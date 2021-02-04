import { spawn } from 'child-process-promise';

import fs from 'fs';
import convert from 'xml-js';
import path from 'path';
import { promisify } from 'util';
import * as os from 'os';

import { AbsolutePositionLettersList, AbsolutePositionTag } from './AbsolutePositionLettersList';

export interface AbsolutePositionReference {
  text: string;
  selectionRectangles: AbsolutePositionTag[];
}

export interface PageSize {
  number: number;
  width: number;
  height: number;
}

const readXml = async (xmlRelativePath: string) => {
  const readFile = promisify(fs.readFile);
  const xmlContentBuffer: Buffer = await readFile(xmlRelativePath);
  return xmlContentBuffer.toString();
};

export class PdfCharacterCountToAbsolute {
  lettersTags: AbsolutePositionLettersList;

  pdfInfo: number[];

  xmlPath = '';

  htmlPath = '';

  pdfPath = '';

  pdfSanitizedPath = '';

  pageSizes: PageSize[];

  constructor() {
    this.lettersTags = new AbsolutePositionLettersList([], []);
    this.pdfInfo = [];
    this.pageSizes = [];
  }

  async loadPdf(pdfRelativePath: string, pagesEndingCharacterCount: number[]) {
    this.pdfPath = pdfRelativePath;
    this.pdfInfo = pagesEndingCharacterCount;
    this.setXmlRelativePath();

    let xmlContentObject;
    let htmlContentObject;
    try {
      await this.convertPdfToXML();
      xmlContentObject = this.convertToJson(await readXml(this.xmlPath));
      htmlContentObject = this.convertToJson(await readXml(this.htmlPath));
    } catch (e) {
      process.stdout.write('sanitizePdf\n');

      await this.sanitizePdf();
      await this.convertPdfToXML();

      xmlContentObject = this.convertToJson(await readXml(this.xmlPath));
      htmlContentObject = this.convertToJson(await readXml(this.htmlPath));
    }

    await this.deleteXmlFile();
    this.lettersTags = AbsolutePositionLettersList.fromXmlObject(
      xmlContentObject,
      htmlContentObject
    );
  }

  private convertToJson(contentString: string) {
    let errorMessage;
    let contentObject;
    for (let iterations = 0; iterations < 300; iterations += 1) {
      try {
        contentObject = JSON.parse(convert.xml2json(contentString));
      } catch (e) {
        errorMessage = e.toString();
        contentString = this.removeFailingLines(errorMessage, contentString);
      }

      if (contentObject) {
        break;
      }
    }

    if (!contentObject) {
      throw new Error(`xml2json error ${errorMessage}\r\n`);
    }
    return contentObject;
  }

  private sanitizeLine(line: string) {
    if (!line.includes('<text')) {
      return line;
    }

    return `${line.split('>')[0]}>${line.split('>')[1].split('<')[0]}</text>`;
  }

  private removeFailingLines(errorMessage: string, xmlContentString: string) {
    let sanitizedContentString = xmlContentString;
    const matches = sanitizedContentString.match(/<text.*<a href=".*<\/text>/g) || [];

    matches.forEach(line => {
      if (!line.includes('</a>')) {
        sanitizedContentString = sanitizedContentString.replace(line, this.sanitizeLine(line));
      }
    });

    const errorLineNumber = parseInt(errorMessage.split('Line: ')[1].split('Column')[0], 10);
    const problematicLine1 = xmlContentString.split('\n')[errorLineNumber - 1];
    const problematicLine2 = xmlContentString.split('\n')[errorLineNumber];

    sanitizedContentString = sanitizedContentString.replace(
      problematicLine1,
      this.sanitizeLine(problematicLine1)
    );
    sanitizedContentString = sanitizedContentString.replace(
      problematicLine2,
      this.sanitizeLine(problematicLine2)
    );
    return sanitizedContentString;
  }

  setXmlRelativePath() {
    const fileName = path.basename(this.pdfPath);
    this.pdfSanitizedPath = `${os.tmpdir()}/${fileName}`;
    this.xmlPath = `${os.tmpdir()}/${fileName.replace('.pdf', '.xml')}`;
    this.htmlPath = `${os.tmpdir()}/${fileName.replace('.pdf', '.html')}`;
  }

  async convertPdfToXML() {
    await spawn('pdftohtml', [
      '-q',
      '-hidden',
      '-xml',
      '-zoom',
      '1.33333',
      '-i',
      this.pdfPath,
      this.xmlPath,
    ]);

    await spawn('pdftotext', ['-q', '-bbox', '-raw', this.pdfPath, this.htmlPath]);
  }

  async sanitizePdf() {
    await spawn('gs', [
      '-q',
      '-o',
      this.pdfSanitizedPath,
      '-sDEVICE=pdfwrite',
      '-dPDFSETTINGS=/prepress',
      this.pdfPath,
    ]);

    this.pdfPath = this.pdfSanitizedPath;
  }

  async deleteXmlFile() {
    const unlink = promisify(fs.unlink);
    await unlink(this.xmlPath);
    await unlink(this.htmlPath);
    if (fs.existsSync(this.pdfSanitizedPath)) {
      await unlink(this.pdfSanitizedPath);
    }
  }

  convertToAbsolutePosition(
    label: string,
    startRange: number,
    endRange: number
  ): AbsolutePositionReference {
    const absolutePositionByStringMatch = this.lettersTags.getAbsolutePositionByStringMatch(label);

    const absolutePositionByCharacterCount = this.getAbsolutePositionByCharacterCount(
      startRange,
      endRange
    );

    const existMatchByCharacterCount = absolutePositionByCharacterCount.length > 0;
    const existMatchByString = absolutePositionByStringMatch.length > 0;

    if (!existMatchByCharacterCount && !existMatchByString) {
      return {
        text: label,
        selectionRectangles: [],
      };
    }
    if (!existMatchByCharacterCount) {
      return {
        text: label,
        selectionRectangles:
          this.lettersTags.getWordsAbsolutePositions(absolutePositionByStringMatch[0]) || [],
      };
    }

    const closerAbsolutePositionStringMatch = this.lettersTags.getWordsAbsolutePositions(
      PdfCharacterCountToAbsolute.getCloserStringMatchToTag(
        absolutePositionByStringMatch,
        absolutePositionByCharacterCount[0]
      )
    );

    const selectionRectangles =
      closerAbsolutePositionStringMatch ||
      absolutePositionByCharacterCount ||
      absolutePositionByStringMatch[0];

    return {
      selectionRectangles,
      text: label,
    };
  }

  static getCloserStringMatchToTag(
    stringMatches: AbsolutePositionTag[][],
    tag: AbsolutePositionTag
  ): AbsolutePositionTag[] {
    const stringMatchesFromMatchingPage = stringMatches.filter(
      x => x[0].pageNumber === tag.pageNumber
    );
    const { top } = tag;
    return stringMatchesFromMatchingPage.reduce(
      (acc, val) => (Math.abs(top - val[0].top) < Math.abs(top - acc[0].top) ? val : acc),
      stringMatches[0]
    );
  }

  private getAbsolutePositionByCharacterCount(startRange: number, endRange: number) {
    const pagesCharacterCountBeforeMatchingPage = this.pdfInfo.filter(x => x < startRange);
    const startingCharacterMatchingPage =
      Number(pagesCharacterCountBeforeMatchingPage.slice(-1)) + 1;

    const startRangeMatchingPage = Math.max(startRange - startingCharacterMatchingPage, 0);
    const endRangeMatchingPage = Math.max(
      endRange - startingCharacterMatchingPage,
      startRangeMatchingPage + 1
    );

    const pageNumber = pagesCharacterCountBeforeMatchingPage.length + 1;

    return this.lettersTags.getCharacterCountMatch(
      pageNumber,
      startRangeMatchingPage,
      endRangeMatchingPage
    );
  }
}

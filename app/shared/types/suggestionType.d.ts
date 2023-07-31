/* eslint-disable */
/**AUTO-GENERATED. RUN yarn emit-types to update.*/

import {
  ObjectIdSchema,
  PropertyValueSchema,
  SelectionRectanglesSchema,
} from 'shared/types/commonTypes';

export interface EntitySuggestionType {
  _id?: ObjectIdSchema;
  entityId: string;
  extractorId: string;
  sharedId: string;
  fileId: string;
  entityTitle: string;
  propertyName: string;
  suggestedValue: PropertyValueSchema;
  currentValue?: PropertyValueSchema;
  labeledValue?: PropertyValueSchema;
  selectionRectangles?: {
    top?: number;
    left?: number;
    width?: number;
    height?: number;
    page?: string;
  }[];
  segment: string;
  language: string;
  state: IXSuggestionStateType;
  page?: number;
  status?: 'processing' | 'failed' | 'ready';
  date: number;
}

export interface IXSuggestionAggregation {
  total: number;
  labeled: {
    _count: number;
    match: number;
    mismatch: number;
  };
  nonLabeled: {
    _count: number;
    noSuggestion: number;
    noContext: number;
    obsolete: number;
    others: number;
  };
}

export interface IXSuggestionType {
  _id?: ObjectIdSchema;
  entityId: string;
  extractorId: ObjectIdSchema;
  entityTemplate: string;
  fileId?: ObjectIdSchema;
  propertyName: string;
  suggestedValue: PropertyValueSchema;
  suggestedText?: string;
  segment: string;
  language: string;
  page?: number;
  status?: 'processing' | 'failed' | 'ready';
  state?: IXSuggestionStateType;
  date?: number;
  error?: string;
  selectionRectangles?: {
    top?: number;
    left?: number;
    width?: number;
    height?: number;
    page?: string;
  }[];
}

export interface IXSuggestionStateType {
  labeled: boolean;
  withValue: boolean;
  withSuggestion: boolean;
  match: boolean;
  hasContext: boolean;
  obsolete: boolean;
  processing: boolean;
  error: boolean;
}

export interface IXSuggestionsQuery {
  filter: IXSuggestionsFilter;
  page?: {
    number: number;
    size: number;
  };
  [k: string]: unknown | undefined;
}

export interface SuggestionCustomFilter {
  labeled: {
    match: boolean;
    mismatch: boolean;
  };
  nonLabeled: {
    noSuggestion: boolean;
    noContext: boolean;
    obsolete: boolean;
    others: boolean;
  };
}

export interface IXSuggestionsFilter {
  language?: string;
  extractorId: ObjectIdSchema;
  customFilter?: SuggestionCustomFilter;
}

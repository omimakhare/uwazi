/* eslint-disable max-lines */
import { getFixturesFactory } from 'api/utils/fixturesFactory';
import { testingDB, DBFixture } from 'api/utils/testing_db';

const factory = getFixturesFactory();

const shared2enId = testingDB.id();
const shared6enId = testingDB.id();

const personTemplateId = testingDB.id();
const heroTemplateId = testingDB.id();

const suggestionSharedId6Title = testingDB.id();
const suggestionSharedId6Enemy = testingDB.id();
const suggestionSharedId6EnemyEs = testingDB.id();

const fixtures: DBFixture = {
  settings: [
    {
      features: {
        metadataExtraction: {
          url: 'https://metadataextraction.com',
        },
      },
    },
  ],
  ixsuggestions: [
    {
      entityId: 'shared1',
      propertyName: 'title',
      suggestedValue: 'Red Robin',
      segment: 'Red Robin, a variation on the traditional Robin persona.',
      language: 'en',
      date: 5,
      page: 2,
      status: 'ready',
    },
    {
      entityId: 'shared1',
      propertyName: 'enemy',
      suggestedValue: 'Red Robin',
      segment: 'Red Robin, a variation on the traditional Robin persona.',
      language: 'en',
      date: 5,
      page: 2,
      status: 'ready',
    },
    {
      entityId: 'shared1',
      propertyName: 'title',
      suggestedValue: 'HCT-04-CR-SC-0074',
      segment: 'Robin Rojo, una variante del Robin tradicional',
      language: 'es',
      date: 5,
      page: 2,
      status: 'ready',
    },
    {
      entityId: 'shared2',
      propertyName: 'super_powers',
      suggestedValue: 'NOT_READY',
      segment: 'Red Robin, a variation on the traditional Robin persona.',
      language: 'en',
      date: 2,
      page: 3,
      status: 'processing',
    },
    {
      entityId: 'shared2',
      propertyName: 'super_powers',
      suggestedValue: 'scientific knowledge',
      segment: 'he relies on his own scientific knowledge',
      language: 'en',
      date: 1,
      page: 5,
      status: 'ready',
    },
    {
      entityId: 'shared2',
      propertyName: 'super_powers',
      suggestedValue: 'conocimiento científico',
      segment: 'el confía en su propio conocimiento científico',
      language: 'es',
      date: 1,
      page: 5,
      status: 'ready',
    },
    {
      entityId: 'shared3',
      propertyName: 'title',
      suggestedValue: 'Alfred Pennyworth',
      segment: "Batman's butler, Alfred Pennyworth",
      language: 'en',
      date: 4,
      page: 3,
      status: 'ready',
    },
    {
      entityId: 'shared3',
      propertyName: 'age',
      suggestedValue: 67,
      segment: 'Alfred 67 years old',
      language: 'en',
      date: 4,
      page: 3,
      status: 'ready',
    },
    {
      entityId: 'shared4',
      propertyName: 'title',
      suggestedValue: 'Joker',
      segment: ' Joker is a homicidal psychopath',
      language: 'en',
      date: 3,
      page: 1,
      status: 'ready',
    },
    {
      entityId: 'shared4',
      propertyName: 'age',
      suggestedValue: 45,
      segment: 'Joker age is 45',
      language: 'en',
      date: 4,
      page: 3,
      status: 'ready',
    },
    {
      entityId: 'shared5',
      propertyName: 'title',
      suggestedValue: 'Poison Ivy',
      segment: 'Poison Ivy is a fictional character appearing in comic books',
      language: 'en',
      date: 6,
      page: 2,
      status: 'ready',
    },
    {
      entityId: 'shared5',
      propertyName: 'age',
      suggestedValue: 25,
      segment: 'Poison Ivy 45 years old',
      language: 'en',
      date: 4,
      page: 3,
      status: 'ready',
    },
    {
      _id: suggestionSharedId6Title,
      entityId: 'shared6',
      propertyName: 'title',
      suggestedValue: 'Penguin',
      segment: 'The Penguin is a Gotham City mobster.',
      language: 'en',
      date: 2,
      page: 12,
      status: 'ready',
    },
    {
      _id: suggestionSharedId6Enemy,
      entityId: 'shared6',
      propertyName: 'enemy',
      suggestedValue: 'Batman',
      segment: 'Enemy: Batman',
      language: 'en',
      date: 5,
      page: 3,
      status: 'ready',
    },
    {
      _id: suggestionSharedId6EnemyEs,
      entityId: 'shared6',
      propertyName: 'enemy',
      suggestedValue: '',
      segment: 'Enemy: Batman',
      language: 'es',
      date: 5,
      page: 3,
      status: 'ready',
    },
  ],
  entities: [
    {
      _id: testingDB.id(),
      sharedId: 'shared1',
      title: 'Robin',
      language: 'en',
      metadata: { enemy: [{ value: 'Red Robin' }] },
      template: personTemplateId,
    },
    {
      _id: testingDB.id(),
      sharedId: 'shared1',
      title: 'Robin es',
      language: 'es',
      template: personTemplateId,
    },
    {
      _id: testingDB.id(),
      sharedId: 'shared2',
      title: 'Batman ar',
      language: 'ar',
      metadata: { super_powers: [{ value: 'scientific knowledge' }] },
      template: personTemplateId,
    },
    {
      _id: shared2enId,
      sharedId: 'shared2',
      title: 'Batman en',
      language: 'en',
      metadata: { super_powers: [{ value: 'scientific knowledge' }] },
      template: personTemplateId,
    },
    {
      _id: testingDB.id(),
      sharedId: 'shared2',
      title: 'Batman es',
      language: 'es',
      metadata: { super_powers: [{ value: 'scientific knowledge' }] },
      template: personTemplateId,
    },
    {
      _id: testingDB.id(),
      sharedId: 'shared3',
      title: 'Alfred',
      language: 'en',
      metadata: { age: [{ value: '' }] },
      template: personTemplateId,
    },
    {
      _id: testingDB.id(),
      sharedId: 'shared4',
      title: 'Joker',
      language: 'en',
      template: personTemplateId,
    },
    {
      _id: testingDB.id(),
      sharedId: 'shared5',
      title: 'Poison Ivy',
      language: 'en',
      metadata: { age: [{ value: 34 }] },
      template: heroTemplateId,
    },
    {
      _id: testingDB.id(),
      sharedId: 'shared6',
      title: 'The Penguin',
      language: 'es',
      metadata: { enemy: [{ value: '' }], age: [{ value: 40 }] },
      template: heroTemplateId,
    },
    {
      _id: shared6enId,
      sharedId: 'shared6',
      title: 'The Penguin',
      language: 'pr',
      metadata: { enemy: [{ value: '' }], age: [{ value: 40 }] },
      template: heroTemplateId,
    },
    {
      _id: testingDB.id(),
      sharedId: 'shared6',
      title: 'The Penguin',
      language: 'en',
      metadata: { enemy: [{ value: '' }], age: [{ value: 40 }] },
      template: heroTemplateId,
    },
  ],
  files: [
    factory.file('F2', 'shared2', 'document', 'documentB.pdf', 'eng', '', [
      {
        name: 'super_powers',
        selection: {
          text: 'scientific knowledge',
          selectionRectangles: [{ top: 0, left: 0, width: 0, height: 0, page: '1' }],
        },
      },
    ]),
    factory.file('F3', 'shared2', 'document', 'documentC.pdf', 'spa', '', [
      {
        name: 'super_powers',
        selection: {
          text: 'conocimiento científico',
          selectionRectangles: [{ top: 0, left: 0, width: 0, height: 0, page: '1' }],
        },
      },
    ]),
  ],
  templates: [
    {
      _id: personTemplateId,
      properties: [
        {
          label: 'Age',
          type: 'numeric',
          name: 'age',
        },
        {
          label: 'Enemy',
          type: 'text',
          name: 'enemy',
        },
      ],
    },
    {
      _id: heroTemplateId,
      properties: [
        {
          label: 'Age',
          type: 'numeric',
          name: 'age',
        },
        {
          label: 'Enemy',
          type: 'text',
          name: 'enemy',
        },
      ],
    },
  ],
};

export {
  fixtures,
  shared2enId,
  shared6enId,
  suggestionSharedId6Title,
  suggestionSharedId6Enemy,
  personTemplateId,
  heroTemplateId,
};

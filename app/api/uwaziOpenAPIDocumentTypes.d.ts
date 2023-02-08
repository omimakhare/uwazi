/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

/** Type helpers */
type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
type XOR<T, U> = T | U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;
type OneOf<T extends any[]> = T extends [infer Only]
  ? Only
  : T extends [infer A, infer B, ...infer Rest]
  ? OneOf<[XOR<A, B>, ...Rest]>
  : never;

export interface paths {
  '/api/v2/search': {
    /**
     * Search entities
     * @description Search entities
     */
    get: {
      /**
       * Search entities
       * @description Search entities
       */
      parameters?: {
        query?: {
          page?: {
            limit?: number;
            offset?: number;
          };
          filter?: {
            searchString?: string;
            sharedId?: string;
            published?: boolean;
            [key: string]:
              | (
                  | {
                      from?: number;
                      to?: number;
                    }
                  | {
                      values?: string[];
                      /** @enum {string} */
                      operator?: 'AND' | 'OR';
                    }
                  | string
                  | number
                  | boolean
                )
              | undefined;
          };
          sort?: string;
          fields?: string[];
        };
      };
      responses: {
        /** @description A JSON array of entities */
        200: {
          content: {
            'application/json': {
              data?: components['schemas']['entity'][];
              links?: {
                self?: string;
                first?: string | null;
                last?: string | null;
                next?: string | null;
                prev?: string | null;
              };
            };
          };
        };
      };
    };
  };
  '/api/pages': {
    /**
     * Get pages
     * @description Get pages
     */
    get: {
      /**
       * Get pages
       * @description Get pages
       */
      parameters?: {
        query?: {
          sharedId?: string;
        };
        /** @example en */
        /**
         * @description The natural language and locale that the client prefers,
         *             will be used if no content-language is provided, in case none are provided.
         *             (api will asume default language configured)
         * @example en
         */
        header?: {
          'Content-Language'?: string;
          'Accept-Language'?: string;
        };
      };
      responses: {
        /** @description Get an array of pages */
        200: {
          content: {
            'application/json': {
              data?: components['schemas']['page'][];
            };
          };
        };
      };
    };
    /** Create or update a page */
    post: {
      /** Create or update a page */
      parameters?: {
        /** @example XMLHttpRequest */
        /** @example en */
        /**
         * @description The natural language and locale that the client prefers,
         *             will be used if no content-language is provided, in case none are provided.
         *             (api will asume default language configured)
         * @example en
         */
        header?: {
          'X-Requested-With'?: string;
          'Content-Language'?: string;
          'Accept-Language'?: string;
        };
      };
      requestBody: {
        content: {
          /**
           * @example {
           *   "title": "test page",
           *   "metadata": {
           *     "content": "my page content"
           *   }
           * }
           */
          'application/json': components['schemas']['page'];
        };
      };
      responses: {
        /** @description Will return the page created / updated */
        200: {
          content: {
            'application/json': {
              data?: components['schemas']['page'];
            };
          };
        };
      };
    };
    /** delete a page */
    delete: {
      /** delete a page */
      parameters: {
        query: {
          sharedId: string;
        };
        /** @example XMLHttpRequest */
        /** @example en */
        /**
         * @description The natural language and locale that the client prefers,
         *             will be used if no content-language is provided, in case none are provided.
         *             (api will asume default language configured)
         * @example en
         */
        header?: {
          'X-Requested-With'?: string;
          'Content-Language'?: string;
          'Accept-Language'?: string;
        };
      };
      responses: {
        /** @description will return acknowledged deletion */
        200: {
          content: {
            'application/json': {
              acknowledged?: boolean;
              deletedCount?: number;
            };
          };
        };
      };
    };
  };
  '/api/page': {
    /**
     * Get a single page
     * @description Get a single page
     */
    get: {
      /**
       * Get a single page
       * @description Get a single page
       */
      parameters: {
        query: {
          sharedId: string;
          slug?: string;
        };
        /** @example en */
        /**
         * @description The natural language and locale that the client prefers,
         *             will be used if no content-language is provided, in case none are provided.
         *             (api will asume default language configured)
         * @example en
         */
        header?: {
          'Content-Language'?: string;
          'Accept-Language'?: string;
        };
      };
      responses: {
        /** @description Get an array of pages */
        200: {
          content: {
            'application/json': {
              data?: components['schemas']['page'];
            };
          };
        };
      };
    };
  };
}

export type webhooks = Record<string, never>;

export interface components {
  schemas: {
    file: {
      _id?: string;
      entity?: string;
      originalname?: string;
      filename?: string;
      mimetype?: string;
      size?: number;
      creationDate?: number;
      language?: string;
      /** @enum {string} */
      type?: 'custom' | 'document' | 'thumbnail' | 'attachment';
      url?: string;
      /** @enum {string} */
      status?: 'processing' | 'failed' | 'ready';
      totalPages?: number;
      generatedToc?: boolean;
      uploaded?: boolean;
      toc?: {
        selectionRectangles?: {
          top?: number;
          left?: number;
          width?: number;
          height?: number;
          page?: string;
        }[];
        label?: string;
        indentation?: number;
      }[];
      extractedMetadata?: {
        propertyID?: string;
        name?: string;
        timestamp?: string;
        deleteSelection?: boolean;
        selection?: {
          text?: string;
          selectionRectangles?: {
            top?: number;
            left?: number;
            width?: number;
            height?: number;
            page?: string;
          }[];
        };
      }[];
    };
    entityMetadataValue: OneOf<
      [
        string | null,
        number | null,
        boolean | null,
        {
          label?: string | null;
          url?: string | null;
        } | null,
        {
          from?: number | null;
          to?: number | null;
        } | null,
        {
          label?: string;
          lat: number;
          lon: number;
        } | null,
        (
          | {
              label?: string;
              lat: number;
              lon: number;
            }[]
          | null
        )
      ]
    >;
    entityMetadata: {
      [key: string]:
        | {
            value: components['schemas']['entityMetadataValue'];
            attachment?: number;
            label?: string;
            suggestion_confidence?: number;
            suggestion_model?: string;
            /** @enum {string} */
            provenance?: '' | 'BULK_ACCEPT';
            inheritedValue?: components['schemas']['entityMetadataValue'];
            inheritedType?: string;
          }[]
        | undefined;
    };
    entity: {
      _id?: string;
      sharedId?: string;
      language?: string;
      title?: string;
      template?: string;
      published?: boolean;
      generatedToc?: boolean;
      icon?: {
        _id?: string;
        label?: string;
        type?: string;
      };
      creationDate?: number;
      user?: string;
      metadata?: components['schemas']['entityMetadata'];
      suggestedMetadata?: components['schemas']['entityMetadata'];
      obsoleteMetadata?: string[];
      attachments?: components['schemas']['file'][];
      documents?: components['schemas']['file'][];
    };
    page: {
      _id?: string;
      title: string;
      language?: string;
      sharedId?: string;
      creationDate?: number;
      metadata?: {
        _id?: string;
        content?: string;
        script?: string;
      };
      user?: string;
      entityView?: boolean;
    };
  };
  responses: never;
  parameters: never;
  requestBodies: never;
  headers: never;
  pathItems: never;
}

export type external = Record<string, never>;

export type operations = Record<string, never>;

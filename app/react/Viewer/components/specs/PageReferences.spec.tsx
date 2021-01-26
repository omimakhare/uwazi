import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import Immutable from 'immutable';
import { Highlight } from 'react-pdf-handler';
import { Provider } from 'react-redux';
import configureStore, { MockStoreCreator } from 'redux-mock-store';

import { PageReferences } from '../PageReferences';

const mockStoreCreator: MockStoreCreator<object> = configureStore<object>([]);

describe('FormConfigInput', () => {
  let props: any;

  beforeEach(() => {
    props = {
      page: '3',
      onClick: jest.fn(),
    };
  });

  const render = () => {
    const store = mockStoreCreator({
      documentViewer: {
        uiState: Immutable.fromJS({ activeReference: '2' }),
        references: Immutable.fromJS([
          { _id: '1', reference: { selectionRectangles: [{ regionId: '2' }] } },
          { _id: '2', reference: { selectionRectangles: [{ regionId: '3' }] } },
          { _id: '3', reference: { selectionRectangles: [{ regionId: '3' }, { regionId: '4' }] } },
          { _id: '4', reference: { selectionRectangles: [{ regionId: '5' }] } },
        ]),
      },
    });

    return shallow(
      <Provider store={store}>
        <PageReferences {...props} />
      </Provider>
    )
      .dive({ context: { store } })
      .dive();
  };

  it('should render Hihlight components with references of the page', () => {
    const component = render();
    const hihglights = component.find(Highlight);
    expect(hihglights.length).toBe(2);

    const firstHighlightProps: any = hihglights.at(0).props();
    expect(firstHighlightProps.regionId).toBe('3');
    expect(firstHighlightProps.color).toBe('#ffd84b');

    const secondHighlightProps: any = hihglights.at(1).props();
    expect(secondHighlightProps.color).toBe('#feeeb4');
  });
});

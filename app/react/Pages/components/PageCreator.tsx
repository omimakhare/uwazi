import { Form, Field, Control } from 'react-redux-form';
import { bindActionCreators, Dispatch } from 'redux';
import { connect, ConnectedProps } from 'react-redux';
import React, { Component } from 'react';

import { MarkDown } from 'app/ReactReduxForms';
import {
  resetPage as resetPageAction,
  savePage as savePageAction,
  updateValue as updateValueAction,
} from 'app/Pages/actions/pageActions';
import ShowIf from 'app/App/ShowIf';
import { BackButton } from 'app/Layout';
import { Icon, ToggleButton } from 'UI';

import { IStore } from 'app/istore';
import { Translate } from 'app/I18N';
import validator from './ValidatePage';

const mapStateToProps = ({ page }: IStore) => ({
  page,
  formState: page.formState,
  savingPage: page.uiState.get('savingPage'),
});

const mapDispatchToProps = (dispatch: Dispatch<{}>) =>
  bindActionCreators(
    { resetPage: resetPageAction, savePage: savePageAction, updateValue: updateValueAction },
    dispatch
  );

const connector = connect(mapStateToProps, mapDispatchToProps);

export type mappedProps = ConnectedProps<typeof connector>;

class PageCreator extends Component<mappedProps> {
  componentWillUnmount() {
    const { resetPage } = this.props;
    resetPage();
  }

  render() {
    const { formState, page, savePage, updateValue, savingPage } = this.props;
    const backUrl = '/settings/pages';
    const pageUrl = `/page/${page.data.sharedId}`;

    let nameGroupClass = 'template-name form-group';
    if (
      formState.title &&
      !formState.title.valid &&
      (formState.submitFailed || formState.title.touched)
    ) {
      nameGroupClass += ' has-error';
    }

    return (
      <div className="page-creator">
        <Form model="page.data" onSubmit={savePage} validators={validator()}>
          <div className="panel panel-default">
            <div className="metadataTemplate-heading panel-heading">
              <div className={nameGroupClass}>
                <Field model=".title">
                  <input placeholder="Page name" className="form-control" />
                </Field>
              </div>
            </div>
            <div className="panel-body page-viewer document-viewer">
              <div className="entity-view">
                <Translate>Enable this page to be used as an entity view page: </Translate>
                <Control
                  model=".entityView"
                  component={ToggleButton}
                  checked={Boolean(page.data.entityView)}
                  onClick={() => {
                    updateValue('.entityView', !page.data.entityView);
                  }}
                />
              </div>
              <ShowIf if={Boolean(page.data._id)}>
                <div className="alert alert-info">
                  <Icon icon="angle-right" /> {pageUrl}
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={pageUrl}
                    className="pull-right"
                  >
                    &nbsp;(view page)
                  </a>
                </div>
              </ShowIf>
              <MarkDown htmlOnViewer model=".metadata.content" rows={18} />
              <div className="alert alert-info">
                <Icon icon="info-circle" size="2x" />
                <div className="force-ltr">
                  Use{' '}
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://guides.github.com/features/mastering-markdown/"
                  >
                    Markdown
                  </a>{' '}
                  syntax to create page content
                  <br />
                  You can also embed advanced components like maps, charts and document lists in
                  your page.&nbsp;
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://github.com/huridocs/uwazi/wiki/Components"
                  >
                    Click here
                  </a>{' '}
                  to learn more about the components.
                </div>
              </div>
              <div>
                <div>
                  <span className="form-group-label">
                    <Translate>Page Javascript</Translate>
                  </span>
                </div>
                <div className="alert alert-warning">
                  <Icon icon="exclamation-triangle" size="2x" />
                  <div className="force-ltr">
                    With great power comes great responsibility!
                    <br />
                    <br />
                    This area allows you to append custom Javascript to the page. This opens up a
                    new universe of possibilities.
                    <br />
                    It could also very easily break the app. Only write code here if you know
                    exactly what you are doing.
                  </div>
                </div>
                <Field model=".metadata.script">
                  <textarea
                    placeholder="// Javascript - With great power comes great responsibility!"
                    className="form-control"
                    rows={12}
                  />
                </Field>
              </div>
            </div>
          </div>
          <div className="settings-footer">
            <BackButton to={backUrl} />
            <button type="submit" className="btn btn-success save-template" disabled={!!savingPage}>
              <Icon icon="save" />
              <span className="btn-label">Save</span>
            </button>
          </div>
        </Form>
      </div>
    );
  }
}

const container = connector(PageCreator);
export { container as PageCreator };

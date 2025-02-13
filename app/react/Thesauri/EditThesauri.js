/** @format */

import React from 'react';

import RouteHandler from 'app/App/RouteHandler';
import ThesauriForm from 'app/Thesauri/components/ThesauriForm';
import { editThesaurus } from 'app/Thesauri/actions/thesaurisActions';
import api from 'app/Thesauri/ThesauriAPI';
import { withRouter } from 'app/componentWrappers';

class EditThesauriComponent extends RouteHandler {
  static async requestState(requestParams) {
    const thesauris = await api.get(requestParams);
    return [editThesaurus(thesauris[0])];
  }

  render() {
    return (
      <div className="settings-content sm-footer-extra-row">
        <ThesauriForm />
      </div>
    );
  }
}

export const EditThesauri = withRouter(EditThesauriComponent);
export { EditThesauriComponent };

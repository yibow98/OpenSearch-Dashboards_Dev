/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  EuiButton,
  EuiFieldPassword,
  EuiFieldText,
  EuiForm,
  EuiFormRow,
  EuiPageContent,
  EuiSpacer,
  EuiSuperSelect,
  EuiText,
  EuiCallOut,
  EuiLink,
} from '@elastic/eui';
import { FormattedMessage } from '@osd/i18n/react';
import { credentialSourceOptions, DataSourceManagementContextValue } from '../../../../types';
import { Header } from '../header';
import { context as contextType } from '../../../../../../opensearch_dashboards_react/public';
import {
  CreateEditDataSourceValidation,
  defaultValidation,
  performDataSourceFormValidation,
} from '../../../validation';
import { AuthType, DataSourceAttributes, UsernamePasswordTypedContent } from '../../../../types';
import {
  createDataSourceCredentialSource,
  createDataSourceDescriptionPlaceholder,
  createDataSourceEndpointPlaceholder,
  createDataSourceEndpointURL,
  createDataSourcePasswordPlaceholder,
  createDataSourceUsernamePlaceholder,
  descriptionText,
  passwordText,
  titleText,
  usernameText,
} from '../../../text_content';

export interface CreateDataSourceProps {
  handleSubmit: (formValues: DataSourceAttributes) => void;
}
export interface CreateDataSourceState {
  /* Validation */
  formErrors: string[];
  formErrorsByField: CreateEditDataSourceValidation;
  /* Inputs */
  title: string;
  description: string;
  endpoint: string;
  auth: {
    type: AuthType;
    credentials: UsernamePasswordTypedContent;
  };
}

export class CreateDataSourceForm extends React.Component<
  CreateDataSourceProps,
  CreateDataSourceState
> {
  static contextType = contextType;
  public readonly context!: DataSourceManagementContextValue;

  constructor(props: CreateDataSourceProps, context: DataSourceManagementContextValue) {
    super(props, context);

    this.state = {
      formErrors: [],
      formErrorsByField: { ...defaultValidation },
      title: '',
      description: '',
      endpoint: '',
      auth: {
        type: AuthType.UsernamePasswordType,
        credentials: {
          username: '',
          password: '',
        },
      },
    };
  }

  /* Validations */

  isFormValid = () => {
    const { formErrors, formErrorsByField } = performDataSourceFormValidation(this.state);

    this.setState({
      formErrors,
      formErrorsByField,
    });

    return formErrors.length === 0;
  };

  /* Events */

  onChangeTitle = (e: { target: { value: any } }) => {
    this.setState({ title: e.target.value }, this.checkValidation);
  };

  onChangeDescription = (e: { target: { value: any } }) => {
    this.setState({ description: e.target.value }, this.checkValidation);
  };

  onChangeEndpoint = (e: { target: { value: any } }) => {
    this.setState({ endpoint: e.target.value }, this.checkValidation);
  };

  onChangeAuthType = (value: AuthType) => {
    this.setState({ auth: { ...this.state.auth, type: value } }, this.checkValidation);
  };

  onChangeUsername = (e: { target: { value: any } }) => {
    this.setState(
      {
        auth: {
          ...this.state.auth,
          credentials: { ...this.state.auth.credentials, username: e.target.value },
        },
      },
      this.checkValidation
    );
  };

  onChangePassword = (e: { target: { value: any } }) => {
    this.setState(
      {
        auth: {
          ...this.state.auth,
          credentials: { ...this.state.auth.credentials, password: e.target.value },
        },
      },
      this.checkValidation
    );
  };

  checkValidation = () => {
    if (this.state.formErrors.length) {
      this.isFormValid();
    }
  };

  onClickCreateNewDataSource = () => {
    if (this.isFormValid()) {
      const formValues: DataSourceAttributes = {
        title: this.state.title,
        description: this.state.description,
        endpoint: this.state.endpoint,
        auth: { ...this.state.auth },
      };

      /* Remove credentials object for NoAuth */
      if (this.state.auth.type === AuthType.NoAuth) {
        delete formValues.auth.credentials;
      }
      /* Submit */
      this.props.handleSubmit(formValues);
    }
  };

  /* Render methods */

  /* Render header*/
  renderHeader = () => {
    return <Header />;
  };

  /* Render Section header*/
  renderSectionHeader = (i18nId: string, defaultMessage: string) => {
    return (
      <>
        <EuiText grow={false}>
          <h4>
            <FormattedMessage id={i18nId} defaultMessage={defaultMessage} />
          </h4>
        </EuiText>
      </>
    );
  };

  renderExperimentalCallout = () => {
    const { docLinks } = this.context.services;
    return (
      <EuiCallOut title="Experimental Feature" iconType="iInCircle">
        <p>
          This feature is experimental. Saved objects created with data from external sources will
          be impacted if the feature is turned off. See documentation{' '}
          <EuiLink
            href={docLinks.links.noDocumentation.indexPatterns.introduction}
            target="_blank"
            external
          >
            <FormattedMessage
              id="dataSourcesManagement.createDataSource.documentation"
              defaultMessage="Documentation"
            />
          </EuiLink>{' '}
          for further information and visit the{' '}
          <EuiLink
            href={docLinks.links.noDocumentation.indexPatterns.introduction}
            target="_blank"
            external
          >
            <FormattedMessage
              id="dataSourcesManagement.createDataSource.documentation"
              defaultMessage="OpenSearch Forum"
            />
          </EuiLink>{' '}
          to submit feedback.
        </p>
      </EuiCallOut>
    );
  };

  /* Render create new credentials*/
  renderCreateNewCredentialsForm = () => {
    return (
      <>
        <EuiFormRow
          label={usernameText}
          isInvalid={!!this.state.formErrorsByField.createCredential.username.length}
          error={this.state.formErrorsByField.createCredential.username}
        >
          <EuiFieldText
            placeholder={createDataSourceUsernamePlaceholder}
            isInvalid={!!this.state.formErrorsByField.createCredential.username.length}
            value={this.state.auth.credentials.username || ''}
            onChange={this.onChangeUsername}
            data-test-subj="createDataSourceFormUsernameField"
          />
        </EuiFormRow>
        <EuiFormRow
          label={passwordText}
          isInvalid={!!this.state.formErrorsByField.createCredential.password.length}
          error={this.state.formErrorsByField.createCredential.password}
        >
          <EuiFieldPassword
            isInvalid={!!this.state.formErrorsByField.createCredential.password.length}
            placeholder={createDataSourcePasswordPlaceholder}
            type={'dual'}
            value={this.state.auth.credentials.password || ''}
            onChange={this.onChangePassword}
            data-test-subj="createDataSourceFormPasswordField"
          />
        </EuiFormRow>
      </>
    );
  };

  renderContent = () => {
    return (
      <>
        {this.renderExperimentalCallout()}
        <EuiSpacer size="l" />
        <EuiPageContent>
          {this.renderHeader()}
          <EuiSpacer size="m" />
          <EuiForm
            data-test-subj="data-source-creation"
            isInvalid={!!this.state.formErrors.length}
            error={this.state.formErrors}
          >
            {/* Endpoint section */}
            {this.renderSectionHeader(
              'dataSourceManagement.connectToDataSource.connectionDetails',
              'Connection Details'
            )}
            <EuiSpacer size="s" />

            {/* Title */}
            <EuiFormRow
              label={titleText}
              isInvalid={!!this.state.formErrorsByField.title.length}
              error={this.state.formErrorsByField.title}
            >
              <EuiFieldText
                name="dataSourceTitle"
                value={this.state.title || ''}
                placeholder={titleText}
                isInvalid={!!this.state.formErrorsByField.title.length}
                onChange={this.onChangeTitle}
                data-test-subj="createDataSourceFormTitleField"
              />
            </EuiFormRow>

            {/* Description */}
            <EuiFormRow label={descriptionText}>
              <EuiFieldText
                name="dataSourceDescription"
                value={this.state.description || ''}
                placeholder={createDataSourceDescriptionPlaceholder}
                onChange={this.onChangeDescription}
                data-test-subj="createDataSourceFormDescriptionField"
              />
            </EuiFormRow>

            {/* Endpoint URL */}
            <EuiFormRow
              label={createDataSourceEndpointURL}
              isInvalid={!!this.state.formErrorsByField.endpoint.length}
              error={this.state.formErrorsByField.endpoint}
            >
              <EuiFieldText
                name="endpoint"
                value={this.state.endpoint || ''}
                placeholder={createDataSourceEndpointPlaceholder}
                isInvalid={!!this.state.formErrorsByField.endpoint.length}
                onChange={this.onChangeEndpoint}
                data-test-subj="createDataSourceFormEndpointField"
              />
            </EuiFormRow>

            {/* Authentication Section: */}

            <EuiSpacer size="xl" />

            {this.renderSectionHeader(
              'dataSourceManagement.connectToDataSource.authenticationHeader',
              'Authentication Method'
            )}

            {/* <EuiText size="s">
              Provide authentication details require to gain access to the endpoint. If no
              authentication is required, choose No authentication.
            </EuiText> */}
            <EuiText>
              <p>
                <FormattedMessage
                  id="dataSourcesManagement.createDataSource.description"
                  defaultMessage="Create a new data source connection to help you retrieve data from an external OpenSearch compatible source."
                />
                <br />
              </p>
            </EuiText>

            {/* Credential source */}
            <EuiSpacer size="s" />
            <EuiFormRow label={createDataSourceCredentialSource}>
              <EuiSuperSelect
                options={credentialSourceOptions}
                valueOfSelected={this.state.auth.type}
                onChange={(value) => this.onChangeAuthType(value)}
                data-test-subj="createDataSourceFormAuthTypeSelect"
              />
            </EuiFormRow>

            {/* Create New credentials */}
            {this.state.auth.type === AuthType.UsernamePasswordType
              ? this.renderCreateNewCredentialsForm()
              : null}

            <EuiSpacer size="xl" />
            {/* Create Data Source button*/}
            <EuiButton
              type="submit"
              fill
              onClick={this.onClickCreateNewDataSource}
              data-test-subj="createDataSourceButton"
            >
              Create a data source connection
            </EuiButton>
          </EuiForm>
        </EuiPageContent>
      </>
    );
  };

  render() {
    return <>{this.renderContent()}</>;
  }
}

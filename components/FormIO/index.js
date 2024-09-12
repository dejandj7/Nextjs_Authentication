import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import dynamic from "next/dist/next-server/lib/dynamic";
import { getFormByPathApi } from "../../redux/form/api";

const Form = dynamic(
  () => import("../../react-formio").then((mod) => mod.Form),
  {
    ssr: false,
  }
);

const FormIOForm = ({
  form,
  formReady,
  className,
  options,
  submission,
  onSubmitButton,
  onChange,
  onError,
  formObject,
}) => {
  const [formDefinition, setFormDefinition] = useState(null);
  const [error, setError] = useState(null);

  FormIOForm.propTypes = {
    form: PropTypes.string,
    className: PropTypes.string,
    formReady: PropTypes.func,
    options: PropTypes.object,
    submission: PropTypes.object,
    onSubmitButton: PropTypes.func,
    onChange: PropTypes.func,
    onError: PropTypes.func,
    formObject: PropTypes.object,
  };

  useEffect(() => {
    if (form !== "") {
      console.debug("FormIOForm getFormByPathApi");
      if (formObject) {
        console.debug("Got form object", formObject);
        setFormDefinition(formObject);
      } else {
        getFormByPathApi(form)
          .then((response) => {
            setFormDefinition(response.data);
          })
          .catch((error) => {
            console.error("getFormByPathApi", error);
            setError("Cant load form");
          });
      }
    }
  }, [form]);

  if (formDefinition) {
    return (
      <Form
        form={formDefinition}
        formReady={formReady}
        className={className}
        options={options}
        submission={submission}
        onSubmitButton={onSubmitButton}
        onChange={onChange}
        onError={onError}
      />
    );
  }

  if (error) {
    return <>There was an error fetch the form</>;
  }

  return <>Loading ...</>;
};

export default FormIOForm;

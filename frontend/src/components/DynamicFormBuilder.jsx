import { SurveyCreatorComponent, SurveyCreator } from "survey-creator-react";
import "survey-core/defaultV2.min.css";
import "survey-creator-core/survey-creator-core.min.css";
import { useEffect, useRef } from 'react';
const creatorOptions = {
  showLogicTab: false,
  isAutoSave: true
};

const defaultJson = {
  pages: [{
    name: "Name",
    elements: [{
      name: "FirstName",
      title: "Enter your first name:",
      type: "text"
    }, {
      name: "LastName",
      title: "Enter your last name:",
      type: "text"
    }]
  }]
};

export default function DynamicFormBuilder() {
    const creator = useRef(new SurveyCreator(creatorOptions));
    //console.log("Creator", creator)
    //console.log("Creator current text", creator.current.text)
  useEffect(() => {
    creator.current.text = window.localStorage.getItem("survey-json") || JSON.stringify(defaultJson);

    creator.current.saveSurveyFunc = async (saveNo, callback) => {
      await fetch("http://localhost:5000/saveForm", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: creator.current.text
      })
      .then(res => res.json())
      .then(data => {
        callback(saveNo, true);
      })
      .catch(error => {
        console.error('Error while saving form:', error);
        callback(saveNo, false);
      });
    };

  }, []);

  return (
    <SurveyCreatorComponent creator={creator.current} />
  );
}
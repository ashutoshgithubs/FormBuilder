 ///Lets code
import { SurveyCreatorComponent, SurveyCreator } from "survey-creator-react";
import * as Survey from "survey-react-ui";
import "survey-core/defaultV2.min.css";
import "survey-creator-core/survey-creator-core.min.css";
import { useEffect, useRef, useState } from 'react';
import axios from "axios";
import {toast} from "react-hot-toast";

const creatorOptions = {
  showLogicTab: true,
  isAutoSave: true
};

export default function DynamicFormBuilder() {
  const [surveyJson, setSurveyJson] = useState({
   
    pages:[
      {
        elements: [
          {
            type: "text",
            name: "Name",
            title: "Full Name",
            isRequired: true
          },
          {
            type: "text",
            name: "email",
            title: "Email",
            isRequired: true
          },
          {
            type: "rating",
            name: "satisfaction",
            title: "How satisfied are you with our product?",
            isRequired: true,
            rateMin: 1,
            rateMax: 5
          },
          {
            type: "comment",
            name: "feedback",
            title: "Please provide your feedback",
            isRequired: true
          }
        ]
      }
    ]
  });

  const creator = useRef(new SurveyCreator(creatorOptions));

  useEffect(() => {
    const saveSurveyFuncHandler = (surveyJson) => {
      setSurveyJson(JSON.parse(surveyJson));
    };
    console.log("Get JSON",creator.current.saveSurveyFunc);
    creator.current.saveSurveyFunc = saveSurveyFuncHandler;
    console.log("Get JSON",creator.current.saveSurveyFunc);

    return () => {
      creator.current.saveSurveyFunc = null;
    };
  }, []);

  const handleComplete = (sender) => {
    console.log("Sending survey data...");
    axios.post("http://localhost:5000/api/survey", sender.data)
      .then(response => {
        toast.success("Form results saved successfully!");
      })
      .catch(error => {
        toast.error("Error while saving form");
        console.error("There was an error saving the form results!", error);
      });
  };

  const survey = new Survey.Model(surveyJson);
  survey.onComplete.add(handleComplete);

  return (
    <div>
      <h1 style={{ textAlign: 'center', color:'green' }}> Feedback Form 📝</h1>
        <Survey.Survey model={survey} />
      <SurveyCreatorComponent creator={creator.current} />
    </div>
  );
}

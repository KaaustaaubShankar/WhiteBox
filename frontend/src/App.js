import React,{useState} from 'react';
import ForceDirectedGraph from './ForceDirectedGraph'; // Import the graph component
import DataBox from './DataBox'; // Component for displaying data
import ChatBox from './ChatBox'; // Component for chat messages

// Sample data for demonstration
const data = [
    {
      "relationship": "MENTIONS",
      "source": {
        "label": "Document",
        "summary": "The summary is not provided. Please provide the text and I will generate a concise summary that accurately captures all the main aspects and core themes. \n\nPlease paste the text you would like me to summarize, and I will return a brief but detailed summary that includes key points and arguments without unnecessary elaboration.",
        "title": "Diagnosis and Staging of Lung Cancer"
      },
      "target": {
        "label": "Entity",
        "title": "iatrogenic pneumothorax"
      }
    },
    {
      "relationship": "MENTIONS",
      "source": {
        "label": "Document",
        "summary": "The summary is not provided. Please provide the text and I will generate a concise summary that accurately captures all the main aspects and core themes. \n\nPlease paste the text you would like me to summarize, and I will return a brief but detailed summary that includes key points and arguments without unnecessary elaboration.",
        "title": "Diagnosis and Staging of Lung Cancer"
      },
      "target": {
        "label": "Entity",
        "title": "mediastinal spread"
      }
    },
    {
      "relationship": "MENTIONS",
      "source": {
        "label": "Document",
        "summary": "The summary is not provided. Please provide the text and I will generate a concise summary that accurately captures all the main aspects and core themes. \n\nPlease paste the text you would like me to summarize, and I will return a brief but detailed summary that includes key points and arguments without unnecessary elaboration.",
        "title": "Diagnosis and Staging of Lung Cancer"
      },
      "target": {
        "label": "Entity",
        "title": "cancer metastasis"
      }
    },
    {
      "relationship": "MENTIONS",
      "source": {
        "label": "Document",
        "summary": "The summary is not provided. Please provide the text and I will generate a concise summary that accurately captures all the main aspects and core themes. \n\nPlease paste the text you would like me to summarize, and I will return a brief but detailed summary that includes key points and arguments without unnecessary elaboration.",
        "title": "Diagnosis and Staging of Lung Cancer"
      },
      "target": {
        "label": "Entity",
        "title": "pleural space invasion"
      }
    },
    {
      "relationship": "MENTIONS",
      "source": {
        "label": "Document",
        "summary": "The summary is not provided. Please provide the text and I will generate a concise summary that accurately captures all the main aspects and core themes. \n\nPlease paste the text you would like me to summarize, and I will return a brief but detailed summary that includes key points and arguments without unnecessary elaboration.",
        "title": "Diagnosis and Staging of Lung Cancer"
      },
      "target": {
        "label": "Entity",
        "title": "effusion"
      }
    },
    {
      "relationship": "MENTIONS",
      "source": {
        "label": "Document",
        "summary": "The summary is not provided. Please provide the text and I will generate a concise summary that accurately captures all the main aspects and core themes. \n\nPlease paste the text you would like me to summarize, and I will return a brief but detailed summary that includes key points and arguments without unnecessary elaboration.",
        "title": "Diagnosis and Staging of Lung Cancer"
      },
      "target": {
        "label": "Entity",
        "title": "bronchoscopy with EBUS-guided node sampling"
      }
    },
    {
      "relationship": "MENTIONS",
      "source": {
        "label": "Document",
        "summary": "The summary is not provided. Please provide the text and I will generate a concise summary that accurately captures all the main aspects and core themes. \n\nPlease paste the text you would like me to summarize, and I will return a brief but detailed summary that includes key points and arguments without unnecessary elaboration.",
        "title": "Diagnosis and Staging of Lung Cancer"
      },
      "target": {
        "label": "Entity",
        "title": "COPD"
      }
    },
    {
      "relationship": "MENTIONS",
      "source": {
        "label": "Document",
        "summary": "The summary is not provided. Please provide the text and I will generate a concise summary that accurately captures all the main aspects and core themes. \n\nPlease paste the text you would like me to summarize, and I will return a brief but detailed summary that includes key points and arguments without unnecessary elaboration.",
        "title": "Diagnosis and Staging of Lung Cancer"
      },
      "target": {
        "label": "Entity",
        "title": "Adam Smith"
      }
    },
    {
      "relationship": "MENTIONS",
      "source": {
        "label": "Document",
        "summary": "The summary is not provided. Please provide the text and I will generate a concise summary that accurately captures all the main aspects and core themes. \n\nPlease paste the text you would like me to summarize, and I will return a brief but detailed summary that includes key points and arguments without unnecessary elaboration.",
        "title": "Diagnosis and Staging of Lung Cancer"
      },
      "target": {
        "label": "Entity",
        "title": "pleural effusion"
      }
    },
    {
      "relationship": "MENTIONS",
      "source": {
        "label": "Document",
        "summary": "The summary is not provided. Please provide the text and I will generate a concise summary that accurately captures all the main aspects and core themes. \n\nPlease paste the text you would like me to summarize, and I will return a brief but detailed summary that includes key points and arguments without unnecessary elaboration.",
        "title": "Diagnosis and Staging of Lung Cancer"
      },
      "target": {
        "label": "Entity",
        "title": "tumour"
      }
    },
    {
      "relationship": "MENTIONS",
      "source": {
        "label": "Document",
        "summary": "The summary is not provided. Please provide the text and I will generate a concise summary that accurately captures all the main aspects and core themes. \n\nPlease paste the text you would like me to summarize, and I will return a brief but detailed summary that includes key points and arguments without unnecessary elaboration.",
        "title": "Diagnosis and Staging of Lung Cancer"
      },
      "target": {
        "label": "Entity",
        "title": "cancer"
      }
    },
    {
      "relationship": "MENTIONS",
      "source": {
        "label": "Document",
        "summary": "Here is a concise summary of the provided text:\n\nThe text discusses various occupational lung diseases and cancers. Pleural mesothelioma typically presents with breathlessness and chest pain, and is almost invariably fatal. Treatment options include palliative care, chemotherapy, and radiotherapy to control symptoms and prolong life by several months. Other occupational lung cancers and diseases mentioned include lung cancer caused by asbestos exposure, occupational pneumonia linked to exposures such as welding and Q fever, and psittacosis caused by infected birds.",
        "title": "Asbestos-Related Diseases: Mesothelioma and Lung Cancer"
      },
      "target": {
        "label": "Entity",
        "title": "palliation of symptoms"
      }
    },
    {
      "relationship": "MENTIONS",
      "source": {
        "label": "Document",
        "summary": "Here is a concise summary of the provided text:\n\nThe text discusses various occupational lung diseases and cancers. Pleural mesothelioma typically presents with breathlessness and chest pain, and is almost invariably fatal. Treatment options include palliative care, chemotherapy, and radiotherapy to control symptoms and prolong life by several months. Other occupational lung cancers and diseases mentioned include lung cancer caused by asbestos exposure, occupational pneumonia linked to exposures such as welding and Q fever, and psittacosis caused by infected birds.",
        "title": "Asbestos-Related Diseases: Mesothelioma and Lung Cancer"
      },
      "target": {
        "label": "Entity",
        "title": "exposed to chromium"
      }
    },
    {
      "relationship": "MENTIONS",
      "source": {
        "label": "Document",
        "summary": "Here is a concise summary of the provided text:\n\nThe text discusses various occupational lung diseases and cancers. Pleural mesothelioma typically presents with breathlessness and chest pain, and is almost invariably fatal. Treatment options include palliative care, chemotherapy, and radiotherapy to control symptoms and prolong life by several months. Other occupational lung cancers and diseases mentioned include lung cancer caused by asbestos exposure, occupational pneumonia linked to exposures such as welding and Q fever, and psittacosis caused by infected birds.",
        "title": "Asbestos-Related Diseases: Mesothelioma and Lung Cancer"
      },
      "target": {
        "label": "Entity",
        "title": "substantial quantities of asbestos"
      }
    },
    {
      "relationship": "MENTIONS",
      "source": {
        "label": "Document",
        "summary": "Here is a concise summary of the provided text:\n\nThe text discusses various occupational lung diseases and cancers. Pleural mesothelioma typically presents with breathlessness and chest pain, and is almost invariably fatal. Treatment options include palliative care, chemotherapy, and radiotherapy to control symptoms and prolong life by several months. Other occupational lung cancers and diseases mentioned include lung cancer caused by asbestos exposure, occupational pneumonia linked to exposures such as welding and Q fever, and psittacosis caused by infected birds.",
        "title": "Asbestos-Related Diseases: Mesothelioma and Lung Cancer"
      },
      "target": {
        "label": "Entity",
        "title": "pneumococcal vaccine"
      }
    },
    {
      "relationship": "MENTIONS",
      "source": {
        "label": "Document",
        "summary": "Here is a concise summary of the provided text:\n\nThe text discusses various occupational lung diseases and cancers. Pleural mesothelioma typically presents with breathlessness and chest pain, and is almost invariably fatal. Treatment options include palliative care, chemotherapy, and radiotherapy to control symptoms and prolong life by several months. Other occupational lung cancers and diseases mentioned include lung cancer caused by asbestos exposure, occupational pneumonia linked to exposures such as welding and Q fever, and psittacosis caused by infected birds.",
        "title": "Asbestos-Related Diseases: Mesothelioma and Lung Cancer"
      },
      "target": {
        "label": "Entity",
        "title": "exposed to dust and fumes from coke plants"
      }
    },
    {
      "relationship": "MENTIONS",
      "source": {
        "label": "Document",
        "summary": "Here is a concise summary of the provided text:\n\nThe text discusses various occupational lung diseases and cancers. Pleural mesothelioma typically presents with breathlessness and chest pain, and is almost invariably fatal. Treatment options include palliative care, chemotherapy, and radiotherapy to control symptoms and prolong life by several months. Other occupational lung cancers and diseases mentioned include lung cancer caused by asbestos exposure, occupational pneumonia linked to exposures such as welding and Q fever, and psittacosis caused by infected birds.",
        "title": "Asbestos-Related Diseases: Mesothelioma and Lung Cancer"
      },
      "target": {
        "label": "Entity",
        "title": "pericardium"
      }
    },
    {
      "relationship": "MENTIONS",
      "source": {
        "label": "Document",
        "summary": "Here is a concise summary of the provided text:\n\nThe text discusses various occupational lung diseases and cancers. Pleural mesothelioma typically presents with breathlessness and chest pain, and is almost invariably fatal. Treatment options include palliative care, chemotherapy, and radiotherapy to control symptoms and prolong life by several months. Other occupational lung cancers and diseases mentioned include lung cancer caused by asbestos exposure, occupational pneumonia linked to exposures such as welding and Q fever, and psittacosis caused by infected birds.",
        "title": "Asbestos-Related Diseases: Mesothelioma and Lung Cancer"
      },
      "target": {
        "label": "Entity",
        "title": "exposed to diesel exhaust fumes"
      }
    },
    {
      "relationship": "MENTIONS",
      "source": {
        "label": "Document",
        "summary": "Here is a concise summary of the provided text:\n\nThe text discusses various occupational lung diseases and cancers. Pleural mesothelioma typically presents with breathlessness and chest pain, and is almost invariably fatal. Treatment options include palliative care, chemotherapy, and radiotherapy to control symptoms and prolong life by several months. Other occupational lung cancers and diseases mentioned include lung cancer caused by asbestos exposure, occupational pneumonia linked to exposures such as welding and Q fever, and psittacosis caused by infected birds.",
        "title": "Asbestos-Related Diseases: Mesothelioma and Lung Cancer"
      },
      "target": {
        "label": "Entity",
        "title": "unremitting"
      }
    },
    {
      "relationship": "MENTIONS",
      "source": {
        "label": "Document",
        "summary": "Here is a concise summary of the provided text:\n\nThe text discusses various occupational lung diseases and cancers. Pleural mesothelioma typically presents with breathlessness and chest pain, and is almost invariably fatal. Treatment options include palliative care, chemotherapy, and radiotherapy to control symptoms and prolong life by several months. Other occupational lung cancers and diseases mentioned include lung cancer caused by asbestos exposure, occupational pneumonia linked to exposures such as welding and Q fever, and psittacosis caused by infected birds.",
        "title": "Asbestos-Related Diseases: Mesothelioma and Lung Cancer"
      },
      "target": {
        "label": "Entity",
        "title": "smoke tobacco"
      }
    },
    {
      "relationship": "MENTIONS",
      "source": {
        "label": "Document",
        "summary": "Here is a concise summary of the provided text:\n\nThe text discusses various occupational lung diseases and cancers. Pleural mesothelioma typically presents with breathlessness and chest pain, and is almost invariably fatal. Treatment options include palliative care, chemotherapy, and radiotherapy to control symptoms and prolong life by several months. Other occupational lung cancers and diseases mentioned include lung cancer caused by asbestos exposure, occupational pneumonia linked to exposures such as welding and Q fever, and psittacosis caused by infected birds.",
        "title": "Asbestos-Related Diseases: Mesothelioma and Lung Cancer"
      },
      "target": {
        "label": "Entity",
        "title": "radon gas"
      }
    },
    {
      "relationship": "MENTIONS",
      "source": {
        "label": "Document",
        "summary": "Here is a concise summary of the provided text:\n\nThe text discusses various occupational lung diseases and cancers. Pleural mesothelioma typically presents with breathlessness and chest pain, and is almost invariably fatal. Treatment options include palliative care, chemotherapy, and radiotherapy to control symptoms and prolong life by several months. Other occupational lung cancers and diseases mentioned include lung cancer caused by asbestos exposure, occupational pneumonia linked to exposures such as welding and Q fever, and psittacosis caused by infected birds.",
        "title": "Asbestos-Related Diseases: Mesothelioma and Lung Cancer"
      },
      "target": {
        "label": "Entity",
        "title": "chromium"
      }
    },
    {
      "relationship": "MENTIONS",
      "source": {
        "label": "Document",
        "summary": "Here is a concise summary of the provided text:\n\nThe text discusses various occupational lung diseases and cancers. Pleural mesothelioma typically presents with breathlessness and chest pain, and is almost invariably fatal. Treatment options include palliative care, chemotherapy, and radiotherapy to control symptoms and prolong life by several months. Other occupational lung cancers and diseases mentioned include lung cancer caused by asbestos exposure, occupational pneumonia linked to exposures such as welding and Q fever, and psittacosis caused by infected birds.",
        "title": "Asbestos-Related Diseases: Mesothelioma and Lung Cancer"
      },
      "target": {
        "label": "Entity",
        "title": "common finding on postmortem"
      }
    },
    {
      "relationship": "MENTIONS",
      "source": {
        "label": "Document",
        "summary": "Here is a concise summary of the provided text:\n\nThe text discusses various occupational lung diseases and cancers. Pleural mesothelioma typically presents with breathlessness and chest pain, and is almost invariably fatal. Treatment options include palliative care, chemotherapy, and radiotherapy to control symptoms and prolong life by several months. Other occupational lung cancers and diseases mentioned include lung cancer caused by asbestos exposure, occupational pneumonia linked to exposures such as welding and Q fever, and psittacosis caused by infected birds.",
        "title": "Asbestos-Related Diseases: Mesothelioma and Lung Cancer"
      },
      "target": {
        "label": "Entity",
        "title": "welders"
      }
    },
    {
      "relationship": "MENTIONS",
      "source": {
        "label": "Document",
        "summary": "Here is a concise summary of the provided text:\n\nThe text discusses various occupational lung diseases and cancers. Pleural mesothelioma typically presents with breathlessness and chest pain, and is almost invariably fatal. Treatment options include palliative care, chemotherapy, and radiotherapy to control symptoms and prolong life by several months. Other occupational lung cancers and diseases mentioned include lung cancer caused by asbestos exposure, occupational pneumonia linked to exposures such as welding and Q fever, and psittacosis caused by infected birds.",
        "title": "Asbestos-Related Diseases: Mesothelioma and Lung Cancer"
      },
      "target": {
        "label": "Entity",
        "title": "exposed to beryllium"
      }
    },
    {
      "relationship": "MENTIONS",
      "source": {
        "label": "Document",
        "summary": "Here is a concise summary of the provided text:\n\nThe text discusses various occupational lung diseases and cancers. Pleural mesothelioma typically presents with breathlessness and chest pain, and is almost invariably fatal. Treatment options include palliative care, chemotherapy, and radiotherapy to control symptoms and prolong life by several months. Other occupational lung cancers and diseases mentioned include lung cancer caused by asbestos exposure, occupational pneumonia linked to exposures such as welding and Q fever, and psittacosis caused by infected birds.",
        "title": "Asbestos-Related Diseases: Mesothelioma and Lung Cancer"
      },
      "target": {
        "label": "Entity",
        "title": "helioma"
      }
    },
    {
      "relationship": "MENTIONS",
      "source": {
        "label": "Document",
        "summary": "Here is a concise summary of the provided text:\n\nThe text discusses various occupational lung diseases and cancers. Pleural mesothelioma typically presents with breathlessness and chest pain, and is almost invariably fatal. Treatment options include palliative care, chemotherapy, and radiotherapy to control symptoms and prolong life by several months. Other occupational lung cancers and diseases mentioned include lung cancer caused by asbestos exposure, occupational pneumonia linked to exposures such as welding and Q fever, and psittacosis caused by infected birds.",
        "title": "Asbestos-Related Diseases: Mesothelioma and Lung Cancer"
      },
      "target": {
        "label": "Entity",
        "title": "highly selected patients"
      }
    },
    {
      "relationship": "MENTIONS",
      "source": {
        "label": "Document",
        "summary": "Here is a concise summary of the provided text:\n\nThe text discusses various occupational lung diseases and cancers. Pleural mesothelioma typically presents with breathlessness and chest pain, and is almost invariably fatal. Treatment options include palliative care, chemotherapy, and radiotherapy to control symptoms and prolong life by several months. Other occupational lung cancers and diseases mentioned include lung cancer caused by asbestos exposure, occupational pneumonia linked to exposures such as welding and Q fever, and psittacosis caused by infected birds.",
        "title": "Asbestos-Related Diseases: Mesothelioma and Lung Cancer"
      },
      "target": {
        "label": "Entity",
        "title": "dust and fumes from coke plants"
      }
    },
    {
      "relationship": "MENTIONS",
      "source": {
        "label": "Document",
        "summary": "Here is a concise summary of the provided text:\n\nThe text discusses various occupational lung diseases and cancers. Pleural mesothelioma typically presents with breathlessness and chest pain, and is almost invariably fatal. Treatment options include palliative care, chemotherapy, and radiotherapy to control symptoms and prolong life by several months. Other occupational lung cancers and diseases mentioned include lung cancer caused by asbestos exposure, occupational pneumonia linked to exposures such as welding and Q fever, and psittacosis caused by infected birds.",
        "title": "Asbestos-Related Diseases: Mesothelioma and Lung Cancer"
      },
      "target": {
        "label": "Entity",
        "title": "exposure to Chlamydia psittaci"
      }
    },
    {
      "relationship": "MENTIONS",
      "source": {
        "label": "Document",
        "summary": "Here is a concise summary of the provided text:\n\nThe text discusses various occupational lung diseases and cancers. Pleural mesothelioma typically presents with breathlessness and chest pain, and is almost invariably fatal. Treatment options include palliative care, chemotherapy, and radiotherapy to control symptoms and prolong life by several months. Other occupational lung cancers and diseases mentioned include lung cancer caused by asbestos exposure, occupational pneumonia linked to exposures such as welding and Q fever, and psittacosis caused by infected birds.",
        "title": "Asbestos-Related Diseases: Mesothelioma and Lung Cancer"
      },
      "target": {
        "label": "Entity",
        "title": "tobacco"
      }
    },
    {
      "relationship": "MENTIONS",
      "source": {
        "label": "Document",
        "summary": "Here is a concise summary of the provided text:\n\nThe text discusses various occupational lung diseases and cancers. Pleural mesothelioma typically presents with breathlessness and chest pain, and is almost invariably fatal. Treatment options include palliative care, chemotherapy, and radiotherapy to control symptoms and prolong life by several months. Other occupational lung cancers and diseases mentioned include lung cancer caused by asbestos exposure, occupational pneumonia linked to exposures such as welding and Q fever, and psittacosis caused by infected birds.",
        "title": "Asbestos-Related Diseases: Mesothelioma and Lung Cancer"
      },
      "target": {
        "label": "Entity",
        "title": "exposure to Coxiella burnetii"
      }
    },
    {
      "relationship": "MENTIONS",
      "source": {
        "label": "Document",
        "summary": "Here is a concise summary of the provided text:\n\nThe text discusses various occupational lung diseases and cancers. Pleural mesothelioma typically presents with breathlessness and chest pain, and is almost invariably fatal. Treatment options include palliative care, chemotherapy, and radiotherapy to control symptoms and prolong life by several months. Other occupational lung cancers and diseases mentioned include lung cancer caused by asbestos exposure, occupational pneumonia linked to exposures such as welding and Q fever, and psittacosis caused by infected birds.",
        "title": "Asbestos-Related Diseases: Mesothelioma and Lung Cancer"
      },
      "target": {
        "label": "Entity",
        "title": "psittacosis"
      }
    },
    {
      "relationship": "MENTIONS",
      "source": {
        "label": "Document",
        "summary": "Here is a concise summary of the provided text:\n\nThe text discusses various occupational lung diseases and cancers. Pleural mesothelioma typically presents with breathlessness and chest pain, and is almost invariably fatal. Treatment options include palliative care, chemotherapy, and radiotherapy to control symptoms and prolong life by several months. Other occupational lung cancers and diseases mentioned include lung cancer caused by asbestos exposure, occupational pneumonia linked to exposures such as welding and Q fever, and psittacosis caused by infected birds.",
        "title": "Asbestos-Related Diseases: Mesothelioma and Lung Cancer"
      },
      "target": {
        "label": "Entity",
        "title": "Pleural mesothelioma"
      }
    },
    {
      "relationship": "MENTIONS",
      "source": {
        "label": "Document",
        "summary": "Here is a concise summary of the provided text:\n\nThe text discusses various occupational lung diseases and cancers. Pleural mesothelioma typically presents with breathlessness and chest pain, and is almost invariably fatal. Treatment options include palliative care, chemotherapy, and radiotherapy to control symptoms and prolong life by several months. Other occupational lung cancers and diseases mentioned include lung cancer caused by asbestos exposure, occupational pneumonia linked to exposures such as welding and Q fever, and psittacosis caused by infected birds.",
        "title": "Asbestos-Related Diseases: Mesothelioma and Lung Cancer"
      },
      "target": {
        "label": "Entity",
        "title": "beryllium"
      }
    },
    {
      "relationship": "MENTIONS",
      "source": {
        "label": "Document",
        "summary": "Here is a concise summary of the provided text:\n\nThe text discusses various occupational lung diseases and cancers. Pleural mesothelioma typically presents with breathlessness and chest pain, and is almost invariably fatal. Treatment options include palliative care, chemotherapy, and radiotherapy to control symptoms and prolong life by several months. Other occupational lung cancers and diseases mentioned include lung cancer caused by asbestos exposure, occupational pneumonia linked to exposures such as welding and Q fever, and psittacosis caused by infected birds.",
        "title": "Asbestos-Related Diseases: Mesothelioma and Lung Cancer"
      },
      "target": {
        "label": "Entity",
        "title": "diesel exhaust fumes"
      }
    },
    {
      "relationship": "MENTIONS",
      "source": {
        "label": "Document",
        "summary": "Here is a concise summary of the provided text:\n\nThe text discusses various occupational lung diseases and cancers. Pleural mesothelioma typically presents with breathlessness and chest pain, and is almost invariably fatal. Treatment options include palliative care, chemotherapy, and radiotherapy to control symptoms and prolong life by several months. Other occupational lung cancers and diseases mentioned include lung cancer caused by asbestos exposure, occupational pneumonia linked to exposures such as welding and Q fever, and psittacosis caused by infected birds.",
        "title": "Asbestos-Related Diseases: Mesothelioma and Lung Cancer"
      },
      "target": {
        "label": "Entity",
        "title": "exposed to radon gas"
      }
    },
    {
      "relationship": "MENTIONS",
      "source": {
        "label": "Document",
        "summary": "Here is a concise summary of the provided text:\n\nThe text discusses various occupational lung diseases and cancers. Pleural mesothelioma typically presents with breathlessness and chest pain, and is almost invariably fatal. Treatment options include palliative care, chemotherapy, and radiotherapy to control symptoms and prolong life by several months. Other occupational lung cancers and diseases mentioned include lung cancer caused by asbestos exposure, occupational pneumonia linked to exposures such as welding and Q fever, and psittacosis caused by infected birds.",
        "title": "Asbestos-Related Diseases: Mesothelioma and Lung Cancer"
      },
      "target": {
        "label": "Entity",
        "title": "exposed to cadmium"
      }
    },
    {
      "relationship": "MENTIONS",
      "source": {
        "label": "Document",
        "summary": "Here is a concise summary of the provided text:\n\nThe text discusses various occupational lung diseases and cancers. Pleural mesothelioma typically presents with breathlessness and chest pain, and is almost invariably fatal. Treatment options include palliative care, chemotherapy, and radiotherapy to control symptoms and prolong life by several months. Other occupational lung cancers and diseases mentioned include lung cancer caused by asbestos exposure, occupational pneumonia linked to exposures such as welding and Q fever, and psittacosis caused by infected birds.",
        "title": "Asbestos-Related Diseases: Mesothelioma and Lung Cancer"
      },
      "target": {
        "label": "Entity",
        "title": "silicosis"
      }
    },
    {
      "relationship": "MENTIONS",
      "source": {
        "label": "Document",
        "summary": "Here is a concise summary of the provided text:\n\nThe text discusses various occupational lung diseases and cancers. Pleural mesothelioma typically presents with breathlessness and chest pain, and is almost invariably fatal. Treatment options include palliative care, chemotherapy, and radiotherapy to control symptoms and prolong life by several months. Other occupational lung cancers and diseases mentioned include lung cancer caused by asbestos exposure, occupational pneumonia linked to exposures such as welding and Q fever, and psittacosis caused by infected birds.",
        "title": "Asbestos-Related Diseases: Mesothelioma and Lung Cancer"
      },
      "target": {
        "label": "Entity",
        "title": "cadmium"
      }
    },
    {
      "relationship": "MENTIONS",
      "source": {
        "label": "Document",
        "summary": "Here is a concise summary of the provided text:\n\nThe text discusses various occupational lung diseases and cancers. Pleural mesothelioma typically presents with breathlessness and chest pain, and is almost invariably fatal. Treatment options include palliative care, chemotherapy, and radiotherapy to control symptoms and prolong life by several months. Other occupational lung cancers and diseases mentioned include lung cancer caused by asbestos exposure, occupational pneumonia linked to exposures such as welding and Q fever, and psittacosis caused by infected birds.",
        "title": "Asbestos-Related Diseases: Mesothelioma and Lung Cancer"
      },
      "target": {
        "label": "Entity",
        "title": "asbestos"
      }
    },
    {
      "relationship": "MENTIONS",
      "source": {
        "label": "Document",
        "summary": "Here is a concise summary of the provided text:\n\nThe text discusses various occupational lung diseases and cancers. Pleural mesothelioma typically presents with breathlessness and chest pain, and is almost invariably fatal. Treatment options include palliative care, chemotherapy, and radiotherapy to control symptoms and prolong life by several months. Other occupational lung cancers and diseases mentioned include lung cancer caused by asbestos exposure, occupational pneumonia linked to exposures such as welding and Q fever, and psittacosis caused by infected birds.",
        "title": "Asbestos-Related Diseases: Mesothelioma and Lung Cancer"
      },
      "target": {
        "label": "Entity",
        "title": "chest pain"
      }
    },
    {
      "relationship": "MENTIONS",
      "source": {
        "label": "Document",
        "summary": "Here is a concise summary of the provided text:\n\nThe text discusses various occupational lung diseases and cancers. Pleural mesothelioma typically presents with breathlessness and chest pain, and is almost invariably fatal. Treatment options include palliative care, chemotherapy, and radiotherapy to control symptoms and prolong life by several months. Other occupational lung cancers and diseases mentioned include lung cancer caused by asbestos exposure, occupational pneumonia linked to exposures such as welding and Q fever, and psittacosis caused by infected birds.",
        "title": "Asbestos-Related Diseases: Mesothelioma and Lung Cancer"
      },
      "target": {
        "label": "Entity",
        "title": "breathlessness"
      }
    },
    {
      "relationship": "MENTIONS",
      "source": {
        "label": "Document",
        "summary": "Here is a concise summary of the provided text:\n\nThe text discusses various occupational lung diseases and cancers. Pleural mesothelioma typically presents with breathlessness and chest pain, and is almost invariably fatal. Treatment options include palliative care, chemotherapy, and radiotherapy to control symptoms and prolong life by several months. Other occupational lung cancers and diseases mentioned include lung cancer caused by asbestos exposure, occupational pneumonia linked to exposures such as welding and Q fever, and psittacosis caused by infected birds.",
        "title": "Asbestos-Related Diseases: Mesothelioma and Lung Cancer"
      },
      "target": {
        "label": "Entity",
        "title": "mediastinum"
      }
    },
    {
      "relationship": "MENTIONS",
      "source": {
        "label": "Document",
        "summary": "Here is a concise summary of the provided text:\n\nThe text discusses various occupational lung diseases and cancers. Pleural mesothelioma typically presents with breathlessness and chest pain, and is almost invariably fatal. Treatment options include palliative care, chemotherapy, and radiotherapy to control symptoms and prolong life by several months. Other occupational lung cancers and diseases mentioned include lung cancer caused by asbestos exposure, occupational pneumonia linked to exposures such as welding and Q fever, and psittacosis caused by infected birds.",
        "title": "Asbestos-Related Diseases: Mesothelioma and Lung Cancer"
      },
      "target": {
        "label": "Entity",
        "title": "chest wall"
      }
    },
    {
      "relationship": "MENTIONS",
      "source": {
        "label": "Document",
        "summary": "Here is a concise summary of the provided text:\n\nThe text discusses various occupational lung diseases and cancers. Pleural mesothelioma typically presents with breathlessness and chest pain, and is almost invariably fatal. Treatment options include palliative care, chemotherapy, and radiotherapy to control symptoms and prolong life by several months. Other occupational lung cancers and diseases mentioned include lung cancer caused by asbestos exposure, occupational pneumonia linked to exposures such as welding and Q fever, and psittacosis caused by infected birds.",
        "title": "Asbestos-Related Diseases: Mesothelioma and Lung Cancer"
      },
      "target": {
        "label": "Entity",
        "title": "Chlamydia psittaci"
      }
    },
    {
      "relationship": "MENTIONS",
      "source": {
        "label": "Document",
        "summary": "Here is a concise summary of the provided text:\n\nThe text discusses various occupational lung diseases and cancers. Pleural mesothelioma typically presents with breathlessness and chest pain, and is almost invariably fatal. Treatment options include palliative care, chemotherapy, and radiotherapy to control symptoms and prolong life by several months. Other occupational lung cancers and diseases mentioned include lung cancer caused by asbestos exposure, occupational pneumonia linked to exposures such as welding and Q fever, and psittacosis caused by infected birds.",
        "title": "Asbestos-Related Diseases: Mesothelioma and Lung Cancer"
      },
      "target": {
        "label": "Entity",
        "title": "Q fever"
      }
    },
    {
      "relationship": "MENTIONS",
      "source": {
        "label": "Document",
        "summary": "Here is a concise summary of the provided text:\n\nThe text discusses various occupational lung diseases and cancers. Pleural mesothelioma typically presents with breathlessness and chest pain, and is almost invariably fatal. Treatment options include palliative care, chemotherapy, and radiotherapy to control symptoms and prolong life by several months. Other occupational lung cancers and diseases mentioned include lung cancer caused by asbestos exposure, occupational pneumonia linked to exposures such as welding and Q fever, and psittacosis caused by infected birds.",
        "title": "Asbestos-Related Diseases: Mesothelioma and Lung Cancer"
      },
      "target": {
        "label": "Entity",
        "title": "Coxiella burnetii"
      }
    },
    {
      "relationship": "MENTIONS",
      "source": {
        "label": "Document",
        "summary": "Here is a concise summary of the provided text:\n\nThe text discusses various occupational lung diseases and cancers. Pleural mesothelioma typically presents with breathlessness and chest pain, and is almost invariably fatal. Treatment options include palliative care, chemotherapy, and radiotherapy to control symptoms and prolong life by several months. Other occupational lung cancers and diseases mentioned include lung cancer caused by asbestos exposure, occupational pneumonia linked to exposures such as welding and Q fever, and psittacosis caused by infected birds.",
        "title": "Asbestos-Related Diseases: Mesothelioma and Lung Cancer"
      },
      "target": {
        "label": "Entity",
        "title": "mesothelioma"
      }
    },
    {
      "relationship": "MENTIONS",
      "source": {
        "label": "Document",
        "summary": "Here is a concise summary of the provided text:\n\nThe text discusses various occupational lung diseases and cancers. Pleural mesothelioma typically presents with breathlessness and chest pain, and is almost invariably fatal. Treatment options include palliative care, chemotherapy, and radiotherapy to control symptoms and prolong life by several months. Other occupational lung cancers and diseases mentioned include lung cancer caused by asbestos exposure, occupational pneumonia linked to exposures such as welding and Q fever, and psittacosis caused by infected birds.",
        "title": "Asbestos-Related Diseases: Mesothelioma and Lung Cancer"
      },
      "target": {
        "label": "Entity",
        "title": "true"
      }
    },
    {
      "relationship": "MENTIONS",
      "source": {
        "label": "Document",
        "summary": "Here is a concise summary of the provided text:\n\nThe text discusses various occupational lung diseases and cancers. Pleural mesothelioma typically presents with breathlessness and chest pain, and is almost invariably fatal. Treatment options include palliative care, chemotherapy, and radiotherapy to control symptoms and prolong life by several months. Other occupational lung cancers and diseases mentioned include lung cancer caused by asbestos exposure, occupational pneumonia linked to exposures such as welding and Q fever, and psittacosis caused by infected birds.",
        "title": "Asbestos-Related Diseases: Mesothelioma and Lung Cancer"
      },
      "target": {
        "label": "Entity",
        "title": "radical surgery"
      }
    },
    {
      "relationship": "MENTIONS",
      "source": {
        "label": "Document",
        "summary": "Here is a concise summary of the provided text:\n\nThe text discusses various occupational lung diseases and cancers. Pleural mesothelioma typically presents with breathlessness and chest pain, and is almost invariably fatal. Treatment options include palliative care, chemotherapy, and radiotherapy to control symptoms and prolong life by several months. Other occupational lung cancers and diseases mentioned include lung cancer caused by asbestos exposure, occupational pneumonia linked to exposures such as welding and Q fever, and psittacosis caused by infected birds.",
        "title": "Asbestos-Related Diseases: Mesothelioma and Lung Cancer"
      },
      "target": {
        "label": "Entity",
        "title": "therapy"
      }
    },
    {
      "relationship": "MENTIONS",
      "source": {
        "label": "Document",
        "summary": "Here is a concise summary of the provided text:\n\nThe text discusses various occupational lung diseases and cancers. Pleural mesothelioma typically presents with breathlessness and chest pain, and is almost invariably fatal. Treatment options include palliative care, chemotherapy, and radiotherapy to control symptoms and prolong life by several months. Other occupational lung cancers and diseases mentioned include lung cancer caused by asbestos exposure, occupational pneumonia linked to exposures such as welding and Q fever, and psittacosis caused by infected birds.",
        "title": "Asbestos-Related Diseases: Mesothelioma and Lung Cancer"
      },
      "target": {
        "label": "Entity",
        "title": "pleural effusion"
      }
    },
    {
      "relationship": "MENTIONS",
      "source": {
        "label": "Document",
        "summary": "Here is a concise summary of the provided text:\n\nThe text discusses various occupational lung diseases and cancers. Pleural mesothelioma typically presents with breathlessness and chest pain, and is almost invariably fatal. Treatment options include palliative care, chemotherapy, and radiotherapy to control symptoms and prolong life by several months. Other occupational lung cancers and diseases mentioned include lung cancer caused by asbestos exposure, occupational pneumonia linked to exposures such as welding and Q fever, and psittacosis caused by infected birds.",
        "title": "Asbestos-Related Diseases: Mesothelioma and Lung Cancer"
      },
      "target": {
        "label": "Entity",
        "title": "metastatic disease"
      }
    },
    {
      "relationship": "MENTIONS",
      "source": {
        "label": "Document",
        "summary": "Here is a concise summary of the provided text:\n\nThe text discusses various occupational lung diseases and cancers. Pleural mesothelioma typically presents with breathlessness and chest pain, and is almost invariably fatal. Treatment options include palliative care, chemotherapy, and radiotherapy to control symptoms and prolong life by several months. Other occupational lung cancers and diseases mentioned include lung cancer caused by asbestos exposure, occupational pneumonia linked to exposures such as welding and Q fever, and psittacosis caused by infected birds.",
        "title": "Asbestos-Related Diseases: Mesothelioma and Lung Cancer"
      },
      "target": {
        "label": "Entity",
        "title": "lung"
      }
    },
    {
      "relationship": "MENTIONS",
      "source": {
        "label": "Document",
        "summary": "Here is a concise summary of the provided text:\n\nThe text discusses various occupational lung diseases and cancers. Pleural mesothelioma typically presents with breathlessness and chest pain, and is almost invariably fatal. Treatment options include palliative care, chemotherapy, and radiotherapy to control symptoms and prolong life by several months. Other occupational lung cancers and diseases mentioned include lung cancer caused by asbestos exposure, occupational pneumonia linked to exposures such as welding and Q fever, and psittacosis caused by infected birds.",
        "title": "Asbestos-Related Diseases: Mesothelioma and Lung Cancer"
      },
      "target": {
        "label": "Entity",
        "title": "chemotherapy"
      }
    },
    {
      "relationship": "MENTIONS",
      "source": {
        "label": "Document",
        "summary": "Here is a concise summary of the provided text:\n\nThe text discusses various occupational lung diseases and cancers. Pleural mesothelioma typically presents with breathlessness and chest pain, and is almost invariably fatal. Treatment options include palliative care, chemotherapy, and radiotherapy to control symptoms and prolong life by several months. Other occupational lung cancers and diseases mentioned include lung cancer caused by asbestos exposure, occupational pneumonia linked to exposures such as welding and Q fever, and psittacosis caused by infected birds.",
        "title": "Asbestos-Related Diseases: Mesothelioma and Lung Cancer"
      },
      "target": {
        "label": "Entity",
        "title": "tumour progression"
      }
    },
    {
      "relationship": "MENTIONS",
      "source": {
        "label": "Document",
        "summary": "Here is a concise summary of the provided text:\n\nThe text discusses various occupational lung diseases and cancers. Pleural mesothelioma typically presents with breathlessness and chest pain, and is almost invariably fatal. Treatment options include palliative care, chemotherapy, and radiotherapy to control symptoms and prolong life by several months. Other occupational lung cancers and diseases mentioned include lung cancer caused by asbestos exposure, occupational pneumonia linked to exposures such as welding and Q fever, and psittacosis caused by infected birds.",
        "title": "Asbestos-Related Diseases: Mesothelioma and Lung Cancer"
      },
      "target": {
        "label": "Entity",
        "title": "radiotherapy"
      }
    }
  ]

function App() {
  const [selectedNode, setSelectedNode] = useState(null);

  return (
    <div className="app-container">
      <header className="app-header">
        <img src="logo.png" alt="Logo" className="logo" /> {/* Ensure the path to your logo is correct */}
      </header>
      <div className="main-content">
        <div className="graph-container">
          <ForceDirectedGraph data={data} onNodeClick={setSelectedNode} />
        </div>
        <div className="info-container">
          <div className="box data-box">
            <DataBox node = {selectedNode} />
          </div>
          <div className="box chat-box">
            <ChatBox />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

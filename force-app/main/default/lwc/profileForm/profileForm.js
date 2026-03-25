// customRecordComponent.js
import { LightningElement, api, wire } from 'lwc';
import getFormFields from '@salesforce/apex/ProfileDataLwcController.getFormFields'
import getFormData from '@salesforce/apex/ProfileDataLwcController.getFormData'
//import saveFormData from '@salesforce/apex/ProfileDataLwcController.saveFormData'
import saveCandidateFields from '@salesforce/apex/ProfileDataLwcController.saveCandidateFields';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { RefreshEvent } from "lightning/refresh";

import CANDIDATE_OBJECT from '@salesforce/schema/CandidateProfile__c'
import NAME_FIELD from '@salesforce/schema/CandidateProfile__c.Name'
import DOB_FIELD from '@salesforce/schema/CandidateProfile__c.Date_of_Birth__c'
import EMAIL_FIELD from '@salesforce/schema/CandidateProfile__c.Email__c'
import GENDER_FIELD from '@salesforce/schema/CandidateProfile__c.Gender__c'
import PHONE_FIELD from '@salesforce/schema/CandidateProfile__c.MobileNo__c'

const SUCCESS_TITLE = 'Success!';
const ERROR_TITLE = 'Error!';
const SUCCESS_VARIANT = 'success';
const ERROR_VARIANT = 'error';
const SUCCESS_MSG = 'Information updated successfully';
export default class ProfileForm extends LightningElement {
    @api recordId;
    record;
    formFields;
    showEditForm = false;
    storeObj ={};
    storeValuesForCancel = {};
    objectName = CANDIDATE_OBJECT
    fields={
        nameField: NAME_FIELD,
        dobfield: DOB_FIELD,
        emailfield: EMAIL_FIELD,
        genderfield: GENDER_FIELD,
        phonefield: PHONE_FIELD,
    }

    @wire(getFormFields)
    wiredFormFields({ error, data }) {
        if (data) {
            this.formFields = data;
            console.log(this.formFields);
        } else if (error) {
            console.log('ERROR');
            console.error(error);
        }
    }

    connectedCallback() {
        // Implement logic to get recordId if needed (e.g., from URL parameter)
        // this.recordId = ...;
        this.loadFormData();
    }

    loadFormData() {
        getFormData({recordId: this.recordId})
        .then(result => {
            console.log('Result '+this.result);
            this.fields.nameField = result.Name;
            this.fields.DOB = result.Date_of_Birth__c;
            this.fields.email = result.Email__c;
            this.fields.gender = result.Gender__c;
            this.fields.phone = result.MobileNo__c;
            console.log(this.fields);
        })
        .catch(error=>{
            console.log('ERROR');
            this.showToastMessage(ERROR_TITLE,error.message,ERROR_VARIANT);
        })
    }

    showToastMessage(title, message, variant) {
        const event = new ShowToastEvent({
            "title": title,
            "message": message,
            "variant": variant
        });
        this.dispatchEvent(event);
    }
/*
    // Load record on component initialization
    connectedCallback() {
        this.loadRecord();
    }

    // Load record using Apex
    loadRecord() {
        getFieldsFromCand({ recordId: this.recordId })
            .then(result => {
                this.record = result;
                console.log('Record '+this.record);
                
            })
            .catch(error => {
                console.error(error);
            });
    }*/

    // Handle Edit button click
    //editRecord() {
    //    this.showEditForm = true;
    //}

    // Handle form submission success
    handleSuccess(event) {
        console.log(event.detail);
        this.showEditForm = false;
        event.preventDefault();
        const fields = event.detail.fields;
        console.log(event.detail.fields);
        saveCandidateFields({ formData: fields, recordId: this.recordId })
            .then(recordId => {
                this.recordId = recordId;
                // Implement any additional logic after save
            })
            .catch(error => {
                console.log('ERROR S');
                console.error(error);
        });
        // Optionally, refresh the record if needed
        // this.loadRecord();
    }

    changeView(){
        this.storeObj = {...this.fields}; 
        this.showEditForm = !this.showEditForm;  
    }

    // Handle form cancellation
    handleCancel() {
        this.showEditForm = false;
    }
}

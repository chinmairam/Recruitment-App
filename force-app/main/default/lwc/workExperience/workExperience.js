
import { LightningElement, wire, api } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import WORK_EXPERIENCE_OBJECT from "@salesforce/schema/Work_Experience__c";
import ID_FIELD from "@salesforce/schema/Work_Experience__c.Id";
import COMPANY_NAME_FIELD from "@salesforce/schema/Work_Experience__c.Company_Name__c";
import START_DATE_FIELD from "@salesforce/schema/Work_Experience__c.JobStartDate__c";
import END_DATE_FIELD from "@salesforce/schema/Work_Experience__c.JobEndDate__c";
import ROLE_FIELD from "@salesforce/schema/Work_Experience__c.Role__c";
import DESCRIPTION_FIELD from "@salesforce/schema/Work_Experience__c.Description__c";
import LOCATION_FIELD from "@salesforce/schema/Work_Experience__c.Work_Location__c";
import IS_CURRENT_FIELD from "@salesforce/schema/Work_Experience__c.IsCurrent__c";
import CANDIDATE_FIELD from "@salesforce/schema/Work_Experience__c.CandidateProfile__c";

import { ShowToastEvent } from 'lightning/platformShowToastEvent';
const SUCCESS_TITLE = 'Success!';
const ERROR_TITLE = 'Error!';
const SUCCESS_VARIANT = 'success';
const ERROR_VARIANT = 'error';
const SUCCESS_MSG = 'Information updated successfully';

const FIELDS = [
    ID_FIELD,
    COMPANY_NAME_FIELD,
    START_DATE_FIELD,
    END_DATE_FIELD,
    ROLE_FIELD,
    DESCRIPTION_FIELD,
    LOCATION_FIELD,
    IS_CURRENT_FIELD,
    CANDIDATE_FIELD
];

export default class WorkExperience extends LightningElement {
    @api recordId;
    @api mode;
    fields = FIELDS;
    objectApiName = 'Work_Experience__c';
    showEditField;

    handleSuccess(event) {
        // Handle successful save
        this.showEditField = false;
        const updatedRecord = event.detail.id;
        console.log('Fields: '+fields);
        console.log(`Record updated with id: ${updatedRecord}`);
        this.showToastMessage(SUCCESS_TITLE,'Record saved successfully!! '+ event.detail.id, SUCCESS_VARIANT);
        //console.log('Record saved successfully:', event.detail.id);
    }

    handleEdit() {
        this.showEditField = !this.showEditField;
    }

    handleSubmit(event) {
        // Handle form submission
        //event.preventDefault(); // Prevents default form submission
        //const fields = event.detail.fields;
        console.log(event.detail.id);
        // Perform additional validations or actions if needed
        //this.template.querySelector('lightning-record-edit-form').submit(fields);
        //this.template.querySelector('lightning-record-form').submit(fields);
    }
    
    showToastMessage(title, message, variant) {
        const toastevent = new ShowToastEvent({
            "title": title,
            "message": message,
            "variant": variant
        });
        this.dispatchEvent(toastevent);
    }

    handleError(event) {
        // Handle errors during save
        console.error('Error saving record:', event.detail);
    }

    // handleReset(event) {
    //     const inputFields = this.template.querySelectorAll(
    //         'lightning-input-field'
    //     );
    //     if (inputFields) {
    //         inputFields.forEach(field => {
    //             field.reset();
    //         });
    //     }
    //  }
}
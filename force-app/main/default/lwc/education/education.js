import { LightningElement, api } from 'lwc';
import EDUCATION_OBJECT from '@salesforce/schema/Education__c';
import INSTITUION_FIELD from '@salesforce/schema/Education__c.Name';
import PASSOUT_FIELD from '@salesforce/schema/Education__c.Passing_Year__c';
import TITLE_FIELD from '@salesforce/schema/Education__c.Title__c';
import CANDIDATE_FIELD from '@salesforce/schema/Education__c.CandidateProfile__c';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';
const SUCCESS_TITLE = 'Success!';
const ERROR_TITLE = 'Error!';
const SUCCESS_VARIANT = 'success';
const ERROR_VARIANT = 'error';
const SUCCESS_MSG = 'Information updated successfully';

const FIELDS = [
    INSTITUION_FIELD,
    PASSOUT_FIELD,
    TITLE_FIELD,
    CANDIDATE_FIELD
];

export default class Education extends LightningElement {
    @api recordId;
    editMode;

    connectedCallback() {
        this.editMode = false;
    }

    setEditMode(){
        this.editMode = true;
    }

    clearEditMode(){
        this.editMode = false;
    }

    handleSuccess(event) {
        const updatedRecord = event.detail.id;
        this.showToastMessage(SUCCESS_TITLE,'Record saved successfully!! '+ event.detail.id, SUCCESS_VARIANT);
    }

    handleError(event) {
        let message = event.detail;
        this.showToast(ERROR_TITLE, message, ERROR_VARIANT);
       this.clearEditMode();
    }
}
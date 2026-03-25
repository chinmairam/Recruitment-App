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
export default class CandidateEducation extends LightningElement {
    @api recordId;
    @api mode;
    //fields = FIELDS;
    fieldList = FIELDS;


    handleSuccess(event) {
        const updatedRecord = event.detail.id;
        this.showToastMessage(SUCCESS_TITLE,'Record saved successfully!! '+ event.detail.id, SUCCESS_VARIANT);
    }

    handleSubmit(event) {
        console.log(event.detail.id);
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
}
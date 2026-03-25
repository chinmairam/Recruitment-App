import { LightningElement, api } from 'lwc';
//Import Navigation Mixin to navigate to record detail pages
import { NavigationMixin } from 'lightning/navigation';

//Import Toast message Event 
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { RefreshEvent } from "lightning/refresh";

import CANDIDATE_PROFILE_OBJECT from "@salesforce/schema/CandidateProfile__c";
import ID_FIELD from "@salesforce/schema/CandidateProfile__c.Id";
import NAME_FIELD from "@salesforce/schema/CandidateProfile__c.Name";
import DOB_FIELD from "@salesforce/schema/CandidateProfile__c.Date_of_Birth__c";
import GENDER_FIELD from "@salesforce/schema/CandidateProfile__c.Gender__c"
import EMAIL_FIELD from "@salesforce/schema/CandidateProfile__c.Email__c";
import PHONE_FIELD from "@salesforce/schema/CandidateProfile__c.MobileNo__c";
import ADDRESS_FIELD from "@salesforce/schema/CandidateProfile__c.Address__c"

import getFieldsFromCand from '@salesforce/apex/ProfileDataLwcController.getFieldsFromCand';
import saveCandidateFields from '@salesforce/apex/ProfileDataLwcController.saveCandidateFields';
const SUCCESS_TITLE = 'Success!';
const ERROR_TITLE = 'Error!';
const SUCCESS_VARIANT = 'success';
const ERROR_VARIANT = 'error';
const SUCCESS_MSG = 'Information updated successfully';

export default class ProfileData extends LightningElement {
    showSpinner = false;
    showError = false;
    showEditForm = false;
    errorMessage = '';
    candidateName
    DOB
    email
    gender 
    phone
    address
    storeObj ={};
    storeValuesForCancel = {};
    @api recordId;
    
    connectedCallback(){
        this.getFieldsFromCandidate();
    }

    // Method to get the values of fields from SF
    getFieldsFromCandidate(){
        getFieldsFromCand({candidateId: this.recordId})
        .then(result => {
            console.log('Result '+this.result);
            let tempObj = {};
            if(result){
                let baseObj = {};
                baseObj.candidateName = result.Name;
                baseObj.DOB = result.Date_of_Birth__c;
                baseObj.email = result.Email__c;
                baseObj.gender = result.Gender__c;
                baseObj.phone = result.Phone__c;
                baseObj.address = result.Address__c;
                tempObj=baseObj;
                console.log('BaseObj'+ this.baseObj);
            }
            this.storeValuesForCancel = tempObj;
            this.storeObj = {...this.storeValuesForCancel};
            console.log('StoreObj '+this.storeObj);
            console.log('Result '+result);
        }).catch(error =>{
            this.showToastMessage(ERROR_TITLE,error.message,ERROR_VARIANT);
        });
    }

    handleSave(){
        this.showSpinner = true;
        this.showEditForm = false;
        saveCandidateFields({recordId : this.recordId, jsonCandRecord : JSON.stringify(this.storeObj)})
        .then(result => {
          if(result == 'success'){
             this.showSpinner = false;
             this.refreshPage();  
             this.getFieldsFromCandidate();
             this.showToastMessage(SUCCESS_TITLE,SUCCESS_MSG,SUCCESS_VARIANT);
          }
          else{
             this.showSpinner = false;
             this.showToastMessage(ERROR_TITLE,result,ERROR_VARIANT);
          }
        })
        .catch(error => {
            this.showToastMessage(ERROR_TITLE, error.message, ERROR_VARIANT);
            this.showSpinner = false;
        })
    }

    refreshPage() {
        this.dispatchEvent(new RefreshEvent());
      }

    // Method to change the page from view to edit form and vice versa
    changeView(){
        this.storeObj = {...this.storeValuesForCancel}; 
        this.showEditForm = !this.showEditForm;  
    }

    // Method to store the values of Preferred Collision Center and Preferred Towing Company when they are changed
    storeValue(event){
       this.storeObj[event.target.name] = event.target.value;
    }

    showToastMessage(title, message, variant) {
        const event = new ShowToastEvent({
            "title": title,
            "message": message,
            "variant": variant
        });
        this.dispatchEvent(event);
    }

    toggleSection(event) {
        let buttonid = event.currentTarget.dataset.buttonid;
        let currentsection = this.template.querySelector('[data-id="' + buttonid + '"]');
        if (currentsection.className.search('slds-is-open') == -1) {
            currentsection.className = 'slds-section slds-is-open';
        } else {
            currentsection.className = 'slds-section slds-is-close';
        }
    }
}

import { LightningElement, api, wire } from "lwc";
import { getRecord, updateRecord, createRecord } from "lightning/uiRecordApi";
import { getObjectInfo, getPicklistValues } from "lightning/uiObjectInfoApi";
import CANDIDATE_PROFILE_OBJECT from "@salesforce/schema/CandidateProfile__c";
import ID_FIELD from "@salesforce/schema/CandidateProfile__c.Id";
import NAME_FIELD from "@salesforce/schema/CandidateProfile__c.Name";
import DOB_FIELD from "@salesforce/schema/CandidateProfile__c.Date_of_Birth__c";
import GENDER_FIELD from "@salesforce/schema/CandidateProfile__c.Gender__c"
import EMAIL_FIELD from "@salesforce/schema/CandidateProfile__c.Email__c";
import PHONE_FIELD from "@salesforce/schema/CandidateProfile__c.MobileNo__c";
import ADDRESS_FIELD from "@salesforce/schema/CandidateProfile__c.Address__c";
import TECHSKILLS_FIELD from "@salesforce/schema/CandidateProfile__c.TechincalSkills__c";
import SOFTSKILLS_FIELD from "@salesforce/schema/CandidateProfile__c.SoftSkills__c";

/*import EDUCATION_FIELD from "@salesforce/schema/CandidateProfile__c.Education__c";
import WORK_EXPERIENCE_FIELD from "@salesforce/schema/CandidateProfile__c.Work_Experience__c";
import SKILLS_FIELD from "@salesforce/schema/CandidateProfile__c.Skills__c";
*/

import { ShowToastEvent } from 'lightning/platformShowToastEvent';
const SUCCESS_TITLE = 'Success!';
const ERROR_TITLE = 'Error!';
const SUCCESS_VARIANT = 'success';
const ERROR_VARIANT = 'error';
const SUCCESS_MSG = 'Information updated successfully';

const FIELDS = [
  NAME_FIELD,
  DOB_FIELD,
  GENDER_FIELD,
  EMAIL_FIELD,
  PHONE_FIELD,
  ADDRESS_FIELD
  // EDUCATION_FIELD,
  // WORK_EXPERIENCE_FIELD,
  // SKILLS_FIELD,
];

export default class CandidateProfile extends LightningElement {
  @api recordId;

  name;
  lastName;
  email;
  phone;
  dob;
  gender;
  address;
  educationLevel;
  workExperience;
  techSkills;
  softSkills;

  picklistValues = []
  error;

  @wire(getObjectInfo, {objectApiName: CANDIDATE_PROFILE_OBJECT})
  candidateInfo

  @wire(getPicklistValues, { recordTypeId:'$candidateInfo.data.defaultRecordTypeId', fieldApiName:GENDER_FIELD})
  genderPicklist({data, error}){
    if(data){
      this.picklistValues = [...data.values];
    }
    if(error){
      this.showToastMessage(ERROR_TITLE,error.message,ERROR_VARIANT);
    }
  }

  @wire(getRecord, { recordId: "$recordId", fields: FIELDS })
  loadCandidateProfile({ error, data }) {
    if (error) {
      this.error = error;
    } else if (data) {
      this.name = data.fields.Name.value;
      this.email = data.fields.Email__c.value;
      this.phone = data.fields.MobileNo__c.value;
      this.dob = data.fields.Date_of_Birth__c.value;
      this.gender = data.fields.Gender__c.value;
      this.address = data.fields.Address__c.value;
      this.techSkills = data.fields.TechincalSkills__c.value;
      this.softSkills = data.fields.SoftSkills__c.value;
    }
  }

  handleNameChange(event) {
    this.name = event.target.value;
  }

  handleEmailChange(event) {
    this.email = event.target.value;
  }

  handlePhoneChange(event) {
    this.phone = event.target.value;
  }

  handleDOBChange(event) {
    this.dob = event.target.value;
  }

  handleGenderChange(event) {
    this.gender = event.target.value;
  }

  handleAddressChange(event) {
    this.address = event.target.value;
  }

  handletechSkillsChange(event) {
    this.techSkills = event.target.value;
  }

  handlesoftSkillsChange(event) {
    this.softSkills = event.target.value;
  }

  handleSave() {
    const fields = {};
    fields[ID_FIELD.fieldApiName] = this.recordId;
    fields[NAME_FIELD.fieldApiName] = this.name;
    fields[EMAIL_FIELD.fieldApiName] = this.email;
    fields[PHONE_FIELD.fieldApiName] = this.phone;
    fields[DOB_FIELD.fieldApiName] = this.dob;
    fields[GENDER_FIELD.fieldApiName] = this.gender;
    fields[ADDRESS_FIELD.fieldApiName] = this.address;
    fields[TECHSKILLS_FIELD.fieldApiName] = this.techSkills;
    fields[SOFTSKILLS_FIELD.fieldApiName] = this.softSkills;
    
    const recordInput = { fields };

    if (this.recordId) {
      // Update existing record
      recordInput.id = this.recordId;
      updateRecord(recordInput)
        .then(() => {
          this.error = undefined;
          this.showToastMessage(SUCCESS_TITLE,SUCCESS_MSG,SUCCESS_VARIANT);
        })
        .catch((error) => {
          this.showToastMessage(ERROR_TITLE,error.message,ERROR_VARIANT);
          this.error = error;
        });
    } else {
      // Create new record
      recordInput.apiName = CANDIDATE_PROFILE_OBJECT.objectApiName;
      createRecord(recordInput)
        .then((record) => {
          this.error = undefined;
          this.recordId = record.id;
          this.showToastMessage(SUCCESS_TITLE,'Record created',SUCCESS_VARIANT);
        })
        .catch((error) => {
          this.showToastMessage(ERROR_TITLE,error.message,ERROR_VARIANT);
          this.error = error;
        });
    }
  }

  refreshPage() {
    this.dispatchEvent(new RefreshEvent());
  }

  showToastMessage(title, message, variant) {
    const event = new ShowToastEvent({
        "title": title,
        "message": message,
        "variant": variant
    });
    this.dispatchEvent(event);
   }
}

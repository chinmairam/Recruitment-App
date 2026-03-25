import { LightningElement, api, wire, track } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import NAME_FIELD from "@salesforce/schema/CandidateProfile__c.Name";
import DOB_FIELD from "@salesforce/schema/CandidateProfile__c.Date_of_Birth__c";
import GENDER_FIELD from "@salesforce/schema/CandidateProfile__c.Gender__c"
import EMAIL_FIELD from "@salesforce/schema/CandidateProfile__c.Email__c";
import PHONE_FIELD from "@salesforce/schema/CandidateProfile__c.MobileNo__c";
import ADDRESS_FIELD from "@salesforce/schema/CandidateProfile__c.Address__c";
import SUMMARY_FIELD from "@salesforce/schema/CandidateProfile__c.Summary__c";
import TECH_SKILLS_FIELD from '@salesforce/schema/CandidateProfile__c.TechincalSkills__c';
import SOFT_SKILLS_FIELD from '@salesforce/schema/CandidateProfile__c.SoftSkills__c'
import OTHER_SKILLS from '@salesforce/schema/CandidateProfile__c.Other_Skills__c'
import INTERESTS from '@salesforce/schema/CandidateProfile__c.Interests__c'
import LANGUAGES from '@salesforce/schema/CandidateProfile__c.Language__c'

const FIELDS = [
  NAME_FIELD,
  DOB_FIELD,
  GENDER_FIELD,
  EMAIL_FIELD,
  PHONE_FIELD,
  ADDRESS_FIELD,
];

export default class MyResumeHeader1 extends LightningElement {
    @api socialDetails
    @api recordId
    @api objectApiName
    @api showActions;
    showActions = true;
    name;
    email;
    phone;
    dob;
    address;

    @track openEditDialog;

    editableFields;

    constructor() {
        super();
        this.openEditDialog = false;
        this.editableFields = [
            NAME_FIELD,
            DOB_FIELD,
            EMAIL_FIELD,
            PHONE_FIELD,
            SUMMARY_FIELD,
            TECH_SKILLS_FIELD,
            SOFT_SKILLS_FIELD,
            OTHER_SKILLS,
            INTERESTS,
            LANGUAGES
        ];
    }

    @wire(getRecord, { recordId: "$recordId", fields: FIELDS })
    userDetailsHandler({data,error}){
        if(data){
            this.name = data.fields.Name.value;
            this.email = data.fields.Email__c.value;
            this.phone = data.fields.MobileNo__c.value;
            this.dob = data.fields.Date_of_Birth__c.value;
            this.address = data.fields.Address__c.value;
        }
        if(error){
            console.error(error);
        }
    }

    get phoneLink(){
        return `tel:${this.phone}`
    }
    get emailLink() {
        return `mailto:${this.email}`
    }

    handleEdit() {
        this.openEditDialog = true;
    }
}
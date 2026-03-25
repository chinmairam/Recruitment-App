import { LightningElement, api, wire } from 'lwc';
import { createRecord, getRecord, updateRecord } from 'lightning/uiRecordApi';
import CANDIDATEPROFILE from '@salesforce/schema/CandidateProfile__c'
import TECH_SKILLS_FIELD from '@salesforce/schema/CandidateProfile__c.TechincalSkills__c';
import SOFT_SKILLS_FIELD from '@salesforce/schema/CandidateProfile__c.SoftSkills__c';
import OTHER_SKILLS from '@salesforce/schema/CandidateProfile__c.Other_Skills__c'
import INTERESTS from '@salesforce/schema/CandidateProfile__c.Interests__c'
import LANGUAGES from '@salesforce/schema/CandidateProfile__c.Language__c'

export default class MyResumeSkills1 extends LightningElement {
    @api details
    @api recordId
    @api objectApiName
    techSkills = []
    softSkills =[]
    otherSkills = []
    interests = []
    languages = []

    viewMode = true;

    @wire(getRecord, {
        recordId:'$recordId',
        fields:[
            TECH_SKILLS_FIELD, 
            SOFT_SKILLS_FIELD,
            OTHER_SKILLS,
            INTERESTS,
            LANGUAGES
        ]
    })skillHandler({data, error}){
        if(data){
            console.log('Skills Data '+JSON.stringify(data));
            this.formatSkills(data)
        }
        if(error){
            console.error("Skills error", error)
        }
    }

    formatSkills(data){
        const {
            TechincalSkills__c,
            SoftSkills__c,
            Other_Skills__c,
            Interests__c,
            Language__c
            } = data.fields
        this.techSkills = TechincalSkills__c ? TechincalSkills__c.value.split(','):[]
        this.softSkills = SoftSkills__c ? SoftSkills__c.value.split(','):[]
        this.otherSkills = Other_Skills__c ? Other_Skills__c.value.split(','):[]
        this.interests = Interests__c ? Interests__c.value.split(','):[]
        this.languages = Language__c ? Language__c.value.split(','):[]
    }
}

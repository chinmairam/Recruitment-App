import { LightningElement, api, wire, track } from 'lwc';
import CANDIDATE_PROFILE from '@salesforce/schema/CandidateProfile__c';
import Id from '@salesforce/user/Id';
import getCandidateId from '@salesforce/apex/setRecordId.getCandidateId';
import * as RESUME_DATA from './myResumeContainerData1';

export default class MyResume1 extends LightningElement {
    SOCIAL_LINKS = RESUME_DATA.SOCIAL_LINKS

    @api recordId
    @wire(getCandidateId, {
        userId: Id
    })
    wiredCandidate({data,error}){
        if(data){
            this.recordId = JSON.parse(JSON.stringify(data))
        }
        if(error){
            this.error = error
        }
    }

    objectApiName = CANDIDATE_PROFILE;
}
import { LightningElement, api, wire, track } from 'lwc';
import CANDIDATE_PROFILE from '@salesforce/schema/CandidateProfile__c';
import Id from '@salesforce/user/Id';
import getCandidateId from '@salesforce/apex/setRecordId.getCandidateId';

export default class PortfolioTabsWrapper extends LightningElement {

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
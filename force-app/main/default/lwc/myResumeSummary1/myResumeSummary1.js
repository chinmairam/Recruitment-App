import { LightningElement, api } from 'lwc';

export default class MyResumeSummary1 extends LightningElement {
    @api details
    @api recordId
    @api objectApiName
    viewMode = true;
}
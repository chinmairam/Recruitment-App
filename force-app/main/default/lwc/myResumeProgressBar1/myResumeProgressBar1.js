import { LightningElement, api } from 'lwc';

export default class MyResumeProgressBar1 extends LightningElement {
    @api progressValue ='0'
    get getStyle(){
        return `width:${this.progressValue}%`
    }
}
trigger LeadConversion on Lead (after update) {
    if(Trigger.isAfter && Trigger.isUpdate){
        LeadConversionHandler.AfterUpdate(Trigger.New);
	}
}
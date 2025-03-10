export interface PytanniaModel {
    GL_Text?: string,
    RESULT?: string,
    innerId: string,
    DPList: DeputyVoiceModel[],
    DocTime: string,
    GLTime: string,
    GLType: string,
    SName: string,
    OrgName: string,
    PD_NPP: string,
    PD_Fullname?: string,
    GL_ResultType?: string,
}

export interface DeputyVoiceModel {
    DPName: string,
    DPGolos: string,
}

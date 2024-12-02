export interface PytanniaModel {
    GL_Text?: string,
    RESULT?: string,
    innerId?: string,
    DPList?: DeputyVoiceModel[],
}

export interface DeputyVoiceModel {
    DPGolos?: string,
    DPName?: string,
}

const config = {
    SUPABASE_URL: 'http://192.168.164.24:8000',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICJyb2xlIjogInNlcnZpY2Vfcm9sZSIsCiAgImlzcyI6ICJzdXBhYmFzZSIsCiAgImlhdCI6IDE3MzMwMDA0MDAsCiAgImV4cCI6IDE4OTA3NjY4MDAKfQ.TIvUAyvZFK-PydwZD3ahHDsUFmI0tXOM6TZOPaoDcxc',
    HOST: "192.168.164.165",
    PORT: 8765,
    DEPARTMENTS: ["Cardioligy"],
    DOCTORS: [{ name: "Mohmmaed", department: "Cardioligy" }],
    QUEUE_HOST: "192.168.164.24",
    QUEUE_PORT: 8770,
    DOCTOR_HOST: "192.168.164.106",
    DOCTOR_PORT: 8775,
    KIOSK_HOST: "192.168.164.165",
    KIOSK_PORT: 8780
};

export default config;
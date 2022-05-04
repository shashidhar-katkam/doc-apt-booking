export const Specialization = [{ key: 'cardiologist', value: "Cardiologist" },
{ key: 'neurologist', value: "Neurologist" },
{ key: 'gastroenterologist', value: "Gastroenterologist" },
{ key: 'orthopedic', value: "Orthopedic" },
{ key: 'pulmonologist', value: "Pulmonologist" },
{ key: 'oncologist', value: "Oncologist" },
{ key: 'ent', value: "Ent Specialist" },
{ key: 'urologist', value: "Urologist" },
{ key: 'general', value: "General Physician" },
]


export const BasicLazyParams = {
    first: 0,
    rows: 10,
    page: 0,
    search: '',
    sortField: null,
    sortOrder: null,
    filters: {
        'name': { value: '', matchMode: 'contains' },
        'country.name': { value: '', matchMode: 'contains' },
        'company': { value: '', matchMode: 'contains' },
        'representative.name': { value: '', matchMode: 'contains' },
    }
}


export const BookingStatus = {
    Booked: 1,
    Visited: 2,
    Cancelled: 3,
}

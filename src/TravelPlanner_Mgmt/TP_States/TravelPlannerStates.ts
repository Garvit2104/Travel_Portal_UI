import { Dayjs } from "dayjs";

export type TravelRequest = {
    request_id :  number,
    raised_by_employee_id: string,
    to_be_approved_by_hr_id: string,
    request_raised_on: Dayjs | Date,
    from_date : Dayjs | null,
    to_date : Dayjs | null,
    purpose_of_travel : string,
    location_id : string,
    request_status : string
    RequestApprovedOn: Date,
    Priority: string
}

export const TravelRequestInitialState : TravelRequest = {
    request_id : 0,
    raised_by_employee_id: "",
    to_be_approved_by_hr_id: "",
    request_raised_on: new Date(),
    from_date : null,
    to_date : null,
    purpose_of_travel : "",
    location_id : '',
    request_status : "",
    RequestApprovedOn: new Date(),
    Priority: ""
}

export type TravelRequestList = TravelRequest[];
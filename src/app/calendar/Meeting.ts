import {Dayjs} from "dayjs";
import Room from "./Room";

export default interface Meeting {
    name: string
    location: Room
    start: Dayjs
    end: Dayjs
    attendees: number
    minutes: number
}

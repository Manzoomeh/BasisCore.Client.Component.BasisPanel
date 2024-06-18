import IDashboardWidgetData from "./IDashboardWidgetData";

export default interface IDashboardCategoryData {
    "title": string,
    "moduleid": number,
    "widgets": IDashboardWidgetData[]
}

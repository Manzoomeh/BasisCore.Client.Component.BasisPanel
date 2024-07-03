import IDashboardWidgetData from "./IdashboardWidgetData";

export default interface IDashboardCategoryData {
    "title": string,
    "moduleid": number,
    "widgets": IDashboardWidgetData[]
}

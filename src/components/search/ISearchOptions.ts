export default interface ISearchOptions {
    title: string;
    icon:  string;
    moduleid: number;
    api: string;
    method : "post" | "get";
    body : object
    // pageids: IPageid[]
}

//  type IPageid = {
//     name : string,
//     pageid : number
// }
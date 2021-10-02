export default interface ITaskOptions{
    id:number;
    title:string;
    cancelable?:boolean;
    task:Promise<any>;
} 
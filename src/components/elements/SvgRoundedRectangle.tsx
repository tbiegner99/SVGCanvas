import React from "react"
export const SvgRoundedRectangle=(props:{width:number,height:number,borderRadius:number,[x:string]:any})=>{
    const {width,height,borderRadius,...otherProps}=props
    return     <path d={`M ${borderRadius} 0
    l ${width-2*borderRadius} 0
   a ${borderRadius} ${borderRadius}, 0, 0, 1, ${borderRadius} ${borderRadius}
   l 0 ${height-2*borderRadius}
   a ${borderRadius} ${borderRadius}, 0, 0, 1, ${-1*borderRadius} ${borderRadius}
   l ${-1*(width-2*borderRadius)} 0
   a ${borderRadius} ${borderRadius}, 0, 0, 1, ${-1*borderRadius} ${-1*borderRadius}
   l 0 ${-1*(height-2*borderRadius)}
   a ${borderRadius} ${borderRadius}, 0, 0, 1, ${borderRadius} ${-1*borderRadius}
    Z`} {...otherProps}/>
}
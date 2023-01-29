import { Dimension } from "../src/utils/math/Dimension"
import {Point} from "../src/utils/math/Point"
import {Vector} from "../src/utils/math/Vector"

describe("Vector  utilities", ()=>{
    describe("Vector add", ()=> {
        it("can add vectors of different types",()=>{
            let a: Point =[1,2];
            let b: Dimension=[3,4]
            let c : Point = Vector.add(a,b)
            expect(c).toEqual([4,6])
        })

    })

    describe("Vector subtract", ()=> {
        it("can add vectors of different types",()=>{
            let a: Point =[1,2];
            let b: Dimension=[3,4]
            let c : Point = Vector.subtract(a,b)
            expect(c).toEqual([-2,-2])
        })

    })
    describe("Vector scalar multiply", ()=> {
        it("can add vectors of different types",()=>{
            let b: Point=[3,4]
            let c : Point = Vector.scalarMultiply(b,2.5)
            expect(c).toEqual([7.5,10])
        })

    })
    describe("Vector scalar multiply", ()=> {
        it("can add vectors of different types",()=>{
            let b: Point=[3,4]
            let c : Point = Vector.scalarMultiply(b,2.5)
            expect(c).toEqual([7.5,10])
        })

    })

    describe("Vector dot product", ()=> {
        it("can add vectors of different types",()=>{
            let b: Point=[3,4]
            let c : number = Vector.dotProduct(b,[-2,6])
            expect(c).toEqual(18)
        })

    })

    describe("Vector absolute value", ()=> {
        it("can add vectors of different types",()=>{
            let b: Point=[-3,4]
            let c : Point = Vector.abs(b)
            expect(c).toEqual([3,4])
        })

    })

    describe("Midpoint", ()=> {
        it("can add vectors of different types",()=>{
            let c : Point = Vector.midpoint([0,0],[10,10])
            expect(c).toEqual([5,5])
        })

    })

    describe("Magnitude", ()=> {
        it("can add vectors of different types",()=>{
            let c : number = Vector.magnitude([3,4])
            expect(c).toEqual(5)
        })

    })

    describe("euclideanDistance", ()=> {
        it("can add vectors of different types",()=>{
            let c : number = Vector.euclideanDistance([3,4],[10,4])
            expect(c).toEqual(7)
        })

    })
})
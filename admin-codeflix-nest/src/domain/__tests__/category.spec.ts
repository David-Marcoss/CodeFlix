import {describe, expect, test} from '@jest/globals';
import { Category } from '../category.entity.js';

describe("Category entity tests", () => {
    test("Category constructor", () => {
        const category = new Category({name: "A volta dos que não forão"})

        expect(category.name).toBe("A volta dos que não forão")
            
    })
})
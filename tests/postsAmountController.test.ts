import { expect, test } from "vitest";
import { mockArray } from "../src/utils/postsAmountController";
import postsAmountController from "../src/utils/postsAmountController";

const post = {
  _id: "66300e40ac6cf0abebd65aa9",
  title: "the greate title 7",
  description:
    "Now the past can be visualized better with the incredible power of AI",
  date: "April 29, 2024 at 5:16 PM ",
  author: "Josue De los santos",
  file: {
    filename: "c40b68e113ffd0943960b4be4dd32032",
    originalname: "clint-patterson-dYEuFB8KQJk-unsplash.jpg",
    mimetype: "image/jpeg",
    path: "uploads/c40b68e113ffd0943960b4be4dd32032",
    size: 1248029,
  },
  __v: 0,
};

// the copy's length will always be less than the model's and more than 5
const copy = mockArray(post, 8); // length should be 8
const model = mockArray(post, 12); // length should be 12
const copy2 = mockArray(post, 6); // length should be 6
const model2 = mockArray(post, 12); // length should be 12

test("mockArray function receives an object and a number, then returns an array with a length similar to that number", () => {
  expect(mockArray(post, 5).length).toBe(5);
});

test("Receives a shallow copy of a model array and a model array. if the model's array length is higher than the copy's and the difference between the model's array and the copy's is less than or equal to 5 it should return the model's array", () => {
  expect(postsAmountController(copy, model)!.length).toBe(12);
});

test("Receives a shallow copy of a model array and a model array. if the model's array length is higher than the copy's and the difference between the model's array and the copy's is more than 5 it should return another array whose length will be the shallow copy's length plus 5.", () => {
  expect(postsAmountController(copy2, model2)!.length).toBe(11);
});

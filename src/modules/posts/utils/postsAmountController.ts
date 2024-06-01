import { postTypes } from "../types";

export function mockArray(post: postTypes, repeat: number) {
  const result: postTypes[] = [];
  for (let index = 0; index < repeat; index++) {
    result.push(post);
  }
  return result;
}

/// This is the main method that allows posts's lazy loading

export default function postsAmountController(
  copy: postTypes[],
  model: postTypes[],
) {
  if (model.length > 5) {
    const difference: number = model.length - copy.length;
    if (difference >= 5) {
      return model.slice(0, copy.length + 5);
    } else {
      return model;
    }
  } else {
    return model;
  }
}

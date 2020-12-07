import produce from "immer";
import { nanoid } from "nanoid/non-secure";
import { comments } from "@globalTypes/types";

type action =
  | {
      type: "ADD_COMMENT";
      x: number;
      y: number;
    }
  | { type: "REMOVE_COMMENT_NEW"; id: number }
  | { type: "SET_COMMENT_COORDINATES"; id: number; x: number; y: number }
  | {
      type: "SET_COMMENT_DIMENSIONS";
      id: number;
      width: number;
      height: number;
    }
  | { type: "SET_COMMENT_TEXT"; id: number; text: string }
  | { type: "SET_COMMENT_COLOR"; id: number; color: string }
  | { type: "DELETE_COMMENT"; id: number };

export const commentsReducer = produce((draft: comments, action: action) => {
  switch (action.type) {
    case "ADD_COMMENT":
      draft[nanoid(10)] = {
        id: nanoid(10),
        text: "",
        x: action.x,
        y: action.y,
        width: 200,
        height: 30,
        color: "blue",
        isNew: true,
      };
      break;

    case "REMOVE_COMMENT_NEW":
      delete draft[action.id].isNew;
      break;

    case "SET_COMMENT_COORDINATES":
      draft[action.id].x = action.x;
      draft[action.id].y = action.y;
      break;

    case "SET_COMMENT_DIMENSIONS":
      draft[action.id].width = action.width;
      draft[action.id].height = action.height;
      break;

    case "SET_COMMENT_TEXT":
      draft[action.id].text = action.text;
      break;

    case "SET_COMMENT_COLOR":
      draft[action.id].color = action.color;
      break;

    case "DELETE_COMMENT":
      delete draft[action.id];
      break;
  }
});

import InputController from "./Controller/InputController";

const MAPPING = {
  text: InputController,
  email: InputController,
  password: InputController,
};

const getField = (type) => {
  const element = MAPPING[type];

  if (!element) {
    return null;
  }

  return element;
};

export default getField;

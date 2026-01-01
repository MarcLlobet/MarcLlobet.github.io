export const getSentenceList = (list: string[]) =>
  list.map((item, itemIndex) => (
    <span key={item}>
      <b>{item}</b>
      {list.length - 2 > itemIndex && ", "}
      {list.length - 2 === itemIndex && " and "}
    </span>
  ));

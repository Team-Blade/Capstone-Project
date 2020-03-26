import React from "react";
import { useForm } from "react-hook-form";
import db from "../src/firebase";

export default function Form() {
  const { register, handleSubmit } = useForm();
  const onSubmit = data => {
    const games = db.collection("games");
    // const code = randomString();
    const code = "12345";

    const newGame = games.doc(code);
    let players = {};
    players[data.name] = { score: 0 };
    newGame.set({ players }, { merge: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input name="playerName" placeholder="Player Name" ref={register} />
      <input type="submit" />
    </form>
  );
}

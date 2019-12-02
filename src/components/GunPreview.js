import { Preview } from "./Preview";
import { GunContinuousSequence } from "crdt-continuous-sequence";
import React, { useState, useEffect } from "react";
import { getPub, useGun, getSet, getId, put } from "nicks-gun-utils";

const Gun = require("gun/gun");
require("gun/sea");

export const GunPreview = ({ id, priv, epriv }) => {
  const [gun, setGun] = useState(null);
  const pub = getPub(id);
  const pair = pub && priv && { pub, priv, epriv };
  const [data, onData] = useGun(Gun, useState, pair);

  useEffect(() => {
    const gun = Gun({
      peers: ["https://gunjs.herokuapp.com/gun"]
    });
    gun.get(id).on(onData);
    gun
      .get(`${id}.atoms`)
      .on(onData)
      .map()
      .on(onData);
    setGun(gun);
  }, []);

  if (!gun) {
    return <div>Loading...</div>;
  }

  const cs = new GunContinuousSequence(gun);
  const document = {
    ...data[id],
    atoms: cs.sort(getSet(data, `${id}.atoms`))
  };

  return (
    <Preview
      getId={getId}
      priv={priv}
      epriv={epriv}
      document={document}
      sort={cs.sort}
      id={id}
      onPublish={async () => {
        await put(
          Gun,
          gun,
          id,
          "content",
          document.atoms.map(atom => atom.atom).join(""),
          pair
        );
      }}
    />
  );
};

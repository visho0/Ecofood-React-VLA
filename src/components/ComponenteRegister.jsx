import React from "react";

const ComponenteRegister = () => (
  <>
    <input
      type="password"
      name="password"
      required
      minLength={6}
      maxLength={128}
      placeholder="Contraseña"
    />
    <input
      type="tel"
      name="phone"
      pattern="[0-9]{10,15}"
      minLength={10}
      maxLength={15}
      placeholder="Ej. 3001234567"
    />
  </>
);

export default ComponenteRegister;

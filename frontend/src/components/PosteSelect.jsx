import { useEffect, useState, useRef } from "react";
import { Form, ListGroup, InputGroup } from "react-bootstrap";
import { getPostesSuggestions } from "utils/postesManager";

export default function PosteSelect({ register, error, setValue, watch }) {
  const [suggestions, setSuggestions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef(null);

  const currentValue = watch("posteContact") || "";

  useEffect(() => {
    const { frequent, others } = getPostesSuggestions();
    const all = [...frequent, ...others];
    setSuggestions(all);
    setFiltered(all);

    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const search = currentValue.toLowerCase();
    setFiltered(suggestions.filter((p) => p.toLowerCase().includes(search)));
  }, [currentValue, suggestions]);

  const handleSelect = (val) => {
    setValue("posteContact", val, { shouldValidate: true });
    setShowDropdown(false);
  };

  return (
    <Form.Group className="mb-3 position-relative" ref={containerRef}>
      <Form.Label className="fw-bold small text-uppercase text-muted">
        Poste / Fonction <span className="text-danger">*</span>
      </Form.Label>
      <InputGroup hasValidation>
        <InputGroup.Text className="bg-white border-end-0">
          <i className="ti ti-briefcase text-primary" />
        </InputGroup.Text>
        <Form.Control
          {...register("posteContact", { required: "Le poste est requis" })}
          placeholder="Saisir ou choisir un poste..."
          className="border-start-0 ps-0"
          autoComplete="off"
          onFocus={() => setShowDropdown(true)}
          isInvalid={!!error}
        />
        <Form.Control.Feedback type="invalid">
          {error?.message}
        </Form.Control.Feedback>
      </InputGroup>
      {showDropdown && (filtered.length > 0 || currentValue.length > 0) && (
        <ListGroup
          className="position-absolute w-100 shadow-lg"
          style={{
            zIndex: 1050,
            maxHeight: "200px",
            overflowY: "auto",
            top: "100%",
          }}
        >
          {filtered.map((p, i) => (
            <ListGroup.Item
              key={i}
              action
              onClick={() => handleSelect(p)}
              className="py-2 small border-0"
            >
              <i className="ti ti-history me-2 text-muted" /> {p}
            </ListGroup.Item>
          ))}
          {!suggestions.includes(currentValue) && currentValue.length > 0 && (
            <ListGroup.Item
              action
              onClick={() => setShowDropdown(false)}
              className="py-2 small text-primary italic border-0"
            >
              <i className="ti ti-plus me-2" /> Utiliser "{currentValue}"
            </ListGroup.Item>
          )}
        </ListGroup>
      )}
    </Form.Group>
  );
}

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { Badge } from "reactstrap";

const InfoSerie = ({ match }) => {
  const [form, setForm] = useState({});
  const [success, setSuccess] = useState(false);
  const [data, setData] = useState({});
  const [mode, setMode] = useState("INFO");
  const [genres, setGenres] = useState([]);
  const [genreId, setGenreId] = useState("");

  useEffect(() => {
    axios.get(`/api/series/${match.params.id}`).then((res) => {
      setData(res.data);
      setForm(res.data);
    });
  }, [match.params.id]);

  useEffect(() => {
    axios.get("/api/genres").then((res) => {
      setGenres(res.data.data);
      const genres = res.data.data;
      const id_genre = genres.find((value) => data.genre === value.name);

      if (id_genre) {
        setGenreId(id_genre.id);
      }
    });
  }, [data]);

  const masterHeader = {
    height: "50vh",
    minHeight: "500px",
    backgroundImage: `url('${data.background}')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  const onChange = (field) => (event) => {
    setForm({
      ...form,
      [field]: event.target.value,
    });
  };

  const onChangeGenre = (event) => {
    setGenreId(event.target.value);
  };

  const seleciona = (value) => () => {
    setForm({
      ...form,
      status: value,
    });
  };

  const save = () => {
    axios
      .put(`/api/series/${match.params.id}`, {
        ...form,
        genre_id: genreId,
      })
      .then((res) => {
        setSuccess(true);
      });
  };

  if (success) {
    return <Redirect to="/series" />;
  }

  return (
    <div>
      <header style={masterHeader}>
        <div className="h-100" style={{ background: "rgba(0,0,0,0.7)" }}>
          <div className="h-100 container">
            <div className="row h-100 align-items-center">
              <div className="col-3">
                <img
                  alt={data.name}
                  className="img-fluid img-thumbnail"
                  src={data.poster}
                />
              </div>
              <div className="col-8">
                <h1 className="font-weight-light text-white">{data.name}</h1>
                <div className="lead text-white">
                  {data.status === "ASSISTIDO" && (
                    <Badge color="success">Assitido</Badge>
                  )}
                  {data.status === "PARA_ASSISTIR" && (
                    <Badge color="warning">Para assistir</Badge>
                  )}
                  Genêro: {data.genre}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container">
        <button onClick={() => setMode("EDIT")} className="btn btn-primary">
          Editar
        </button>
      </div>

      {mode === "EDIT" && (
        <div className="container">
          <h1>Editar série</h1>
          <button onClick={() => setMode("INFO")} className="btn btn-primary">
            Cancelar edição
          </button>
          <form>
            <div className="form-group">
              <label htmlFor="name">Nome</label>
              <input
                type="text"
                value={form.name}
                onChange={onChange("name")}
                className="form-control"
                id="name"
                placeholder="Nome da série..."
              />
            </div>

            <div className="form-group">
              <label htmlFor="name">Cometários</label>
              <input
                type="text"
                value={"undefined" && form.comments}
                onChange={onChange("comments")}
                className="form-control"
                id="name"
                placeholder="Comentário..."
              />
            </div>

            <div className="form-group">
              <label htmlFor="name">Genêro</label>
              <select
                className="form-control"
                onChange={onChangeGenre}
                value={genreId}
              >
                {genres.map((genre) => (
                  <option key={genre.id} value={genre.id}>
                    {genre.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="status"
                id="assistido"
                value="ASSISTIDO"
                checked={form.status === "ASSISTIDO"}
                onChange={seleciona("ASSISTIDO")}
              />
              <label className="form-check-label">Assistido</label>
            </div>

            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="status"
                id="paraAssistir"
                value="PARA_ASSISTIR"
                checked={form.status === "PARA_ASSISTIR"}
                onChange={seleciona("PARA_ASSISTIR")}
              />
              <label className="form-check-label">Para assistir</label>
            </div>

            <button type="button" onClick={save} className="btn btn-primary">
              Salvar
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default InfoSerie;

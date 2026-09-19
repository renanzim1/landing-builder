"use client";

import { useEffect, useState } from "react";

const id = () => crypto.randomUUID();

export default function Home() {
  const [blocks, setBlocks] = useState([]);
  const [preview, setPreview] = useState(false);
  const [selected, setSelected] = useState([]);
  const [buttonEditor, setButtonEditor] = useState(null);

  useEffect(() => {
    return () => {
      blocks.forEach((b) => {
        if (b.url) URL.revokeObjectURL(b.url);

        if (b.items) {
          b.items.forEach((item) => {
            if (item.url) URL.revokeObjectURL(item.url);
          });
        }
      });
    };
  }, []);

  function addFiles(fileList) {
    const incoming = [...fileList].filter(
      (f) => f.type.startsWith("image/") || f.type.startsWith("video/")
    );

    setBlocks((prev) => [
      ...prev,
      ...incoming.map((file) => ({
        id: id(),
        type: file.type.startsWith("video/") ? "video" : "image",
        name: file.name,
        file,
        url: URL.createObjectURL(file),
        button: null,

        // Transição padrão
        transition: "soft",
      })),
    ]);
  }

  function move(index, delta) {
    const next = [...blocks];
    const to = index + delta;

    if (to < 0 || to >= next.length) return;

    [next[index], next[to]] = [next[to], next[index]];

    setBlocks(next);
  }

  function removeBlock(blockId) {
    setBlocks((prev) => prev.filter((b) => b.id !== blockId));

    setSelected((prev) => prev.filter((x) => x !== blockId));
  }

  function saveButton(e) {
    e.preventDefault();

    const form = new FormData(e.currentTarget);

    const text = String(form.get("text") || "").trim();
    const href = String(form.get("href") || "").trim();

    if (!text || !href) return;

    setBlocks((prev) =>
      prev.map((b) =>
        b.id === buttonEditor
          ? {
              ...b,
              button: {
                text,
                href,
              },
            }
          : b
      )
    );

    setButtonEditor(null);
  }

  function createCarousel() {
    if (selected.length < 2) return;

    const chosen = blocks.filter(
      (b) => selected.includes(b.id) && b.type === "image"
    );

    if (chosen.length < 2) return;

    const firstIndex = Math.min(
      ...chosen.map((c) => blocks.findIndex((b) => b.id === c.id))
    );

    const rest = blocks.filter((b) => !selected.includes(b.id));

    const carousel = {
      id: id(),
      type: "carousel",
      name: "Carrossel",
      items: chosen,
      button: null,
      transition: "soft",
    };

    rest.splice(firstIndex, 0, carousel);

    setBlocks(rest);
    setSelected([]);
  }

  function changeTransition(blockId, value) {
    setBlocks((prev) =>
      prev.map((b) =>
        b.id === blockId
          ? {
              ...b,
              transition: value,
            }
          : b
      )
    );
  }

  return (
    <main className="shell">
      <header className="top">
        <div>
          <span className="eyebrow">LANDING BUILDER</span>

          <h1>Imagens e vídeos viram uma landing.</h1>

          <p>
            Suba, organize, adicione links ou carrosséis e visualize o
            resultado.
          </p>
        </div>

        <button
          className="ghost"
          disabled={!blocks.length}
          onClick={() => setPreview(true)}
        >
          Pré-visualizar
        </button>
      </header>

      <section
        className="drop"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          addFiles(e.dataTransfer.files);
        }}
      >
        <div className="dropIcon">＋</div>

        <h2>Adicione suas artes e vídeos</h2>

        <p>
          PNG, JPG, WebP e MP4. Você poderá mudar a ordem depois.
        </p>

        <label className="primary">
          Selecionar arquivos

          <input
            hidden
            multiple
            type="file"
            accept="image/*,video/mp4"
            onChange={(e) => addFiles(e.target.files)}
          />
        </label>
      </section>

      <section className="workspace">
        <div className="sectionTitle">
          <div>
            <h2>Sua landing</h2>

            <p>
              {blocks.length
                ? `${blocks.length} bloco(s)`
                : "Os arquivos aparecerão aqui."}
            </p>
          </div>

          {selected.length >= 2 && (
            <button
              className="secondary"
              onClick={createCarousel}
            >
              Criar carrossel ({selected.length})
            </button>
          )}
        </div>

        {!blocks.length ? (
          <div className="empty">
            Comece enviando as imagens na ordem da sua página.
          </div>
        ) : (
          blocks.map((b, index) => (
            <article className="block" key={b.id}>
              <div className="thumb">
                {b.type === "image" && (
                  <img src={b.url} alt="" />
                )}

                {b.type === "video" && (
                  <video src={b.url} muted />
                )}

                {b.type === "carousel" && (
                  <div className="carouselThumb">
                    🎠
                    <small>{b.items.length} imagens</small>
                  </div>
                )}
              </div>

              <div className="blockInfo">
                <strong>
                  <span>
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {b.name}
                </strong>

                <small>
                  {b.type === "image"
                    ? "Imagem"
                    : b.type === "video"
                    ? "Vídeo"
                    : "Carrossel"}
                </small>
              </div>

              <div className="actions">
                {b.type === "image" && (
                  <label className="check">
                    <input
                      type="checkbox"
                      checked={selected.includes(b.id)}
                      onChange={() =>
                        setSelected((s) =>
                          s.includes(b.id)
                            ? s.filter((x) => x !== b.id)
                            : [...s, b.id]
                        )
                      }
                    />

                    Selecionar
                  </label>
                )}

                {(b.type === "image" ||
                  b.type === "carousel") && (
                  <button
                    onClick={() => setButtonEditor(b.id)}
                  >
                    🔗 {b.button ? "Editar botão" : "Botão"}
                  </button>
                )}

                {index > 0 && (
                  <label className="transitionControl">
                    <span>Transição</span>

                    <select
                      value={b.transition || "soft"}
                      onChange={(e) =>
                        changeTransition(
                          b.id,
                          e.target.value
                        )
                      }
                    >
                      <option value="none">
                        Nenhuma
                      </option>

                      <option value="soft">
                        Suave
                      </option>

                      <option value="strong">
                        Forte
                      </option>
                    </select>
                  </label>
                )}

                <button
                  aria-label="Mover para cima"
                  onClick={() => move(index, -1)}
                >
                  ↑
                </button>

                <button
                  aria-label="Mover para baixo"
                  onClick={() => move(index, 1)}
                >
                  ↓
                </button>

                <button
                  className="danger"
                  onClick={() => removeBlock(b.id)}
                >
                  Excluir
                </button>
              </div>
            </article>
          ))
        )}
      </section>

      <footer className="bottomBar">
        <button
          className="ghost"
          disabled={!blocks.length}
          onClick={() => setPreview(true)}
        >
          👁 Pré-visualizar
        </button>

        <button
          className="publish"
          disabled={!blocks.length}
          title="A publicação será conectada na próxima etapa"
        >
          🚀 Publicar
        </button>
      </footer>

      {buttonEditor && (
        <div
          className="modalBackdrop"
          onMouseDown={() =>
            setButtonEditor(null)
          }
        >
          <form
            className="modal"
            onSubmit={saveButton}
            onMouseDown={(e) =>
              e.stopPropagation()
            }
          >
            <h2>Adicionar botão</h2>

            <p>
              O botão ficará integrado à seção.
            </p>

            <label>
              Texto

              <input
                name="text"
                placeholder="QUERO SABER MAIS"
                required
              />
            </label>

            <label>
              Link

              <input
                name="href"
                type="url"
                placeholder="https://..."
                required
              />
            </label>

            <div className="modalActions">
              <button
                type="button"
                className="ghost"
                onClick={() =>
                  setButtonEditor(null)
                }
              >
                Cancelar
              </button>

              <button
                className="primary"
                type="submit"
              >
                Adicionar
              </button>
            </div>
          </form>
        </div>
      )}

      {preview && (
        <div className="preview">
          <div className="previewTop">
            <strong>Pré-visualização</strong>

            <button
              onClick={() =>
                setPreview(false)
              }
            >
              Fechar ✕
            </button>
          </div>

          <div className="site">
            {blocks.map((b, index) => (
              <RenderBlock
                key={b.id}
                block={b}
                first={index === 0}
              />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}

/* =====================================================
   RENDERIZAÇÃO
===================================================== */

function RenderBlock({ block, first }) {
  if (block.type === "carousel") {
    return (
      <Carousel
        block={block}
        first={first}
      />
    );
  }

  const transition =
    first
      ? "none"
      : block.transition || "soft";

  return (
    <section
      className={`mediaSection transition-${transition}`}
    >
      {/*
        A camada abaixo usa a própria mídia
        para criar a fusão entre seções.
      */}

      {!first &&
        block.type === "image" &&
        transition !== "none" && (
          <div
            className="transitionBridge"
            aria-hidden="true"
          >
            <img src={block.url} alt="" />
          </div>
        )}

      <div className="mediaContent">
        {block.type === "image" ? (
          <img
            src={block.url}
            alt=""
            draggable="false"
          />
        ) : (
          <video
            src={block.url}
            controls
            playsInline
          />
        )}
      </div>

      {block.button && (
        <a
          className="cta"
          href={block.button.href}
          target="_blank"
          rel="noreferrer"
        >
          {block.button.text}
        </a>
      )}
    </section>
  );
}

/* =====================================================
   CARROSSEL
===================================================== */

function Carousel({ block, first }) {
  const [slide, setSlide] = useState(0);

  const transition =
    first
      ? "none"
      : block.transition || "soft";

  const current = block.items[slide];

  return (
    <section
      className={`mediaSection carousel transition-${transition}`}
    >
      {!first &&
        transition !== "none" &&
        current && (
          <div
            className="transitionBridge"
            aria-hidden="true"
          >
            <img
              src={current.url}
              alt=""
            />
          </div>
        )}

      <div className="mediaContent">
        <img
          src={current.url}
          alt=""
          draggable="false"
        />
      </div>

      <button
        className="prev"
        onClick={() =>
          setSlide(
            (slide - 1 + block.items.length) %
              block.items.length
          )
        }
      >
        ‹
      </button>

      <button
        className="next"
        onClick={() =>
          setSlide(
            (slide + 1) %
              block.items.length
          )
        }
      >
        ›
      </button>

      <div className="dots">
        {block.items.map((_, i) => (
          <button
            key={i}
            className={
              i === slide ? "active" : ""
            }
            onClick={() =>
              setSlide(i)
            }
          />
        ))}
      </div>

      {block.button && (
        <a
          className="cta"
          href={block.button.href}
          target="_blank"
          rel="noreferrer"
        >
          {block.button.text}
        </a>
      )}
    </section>
  );
}

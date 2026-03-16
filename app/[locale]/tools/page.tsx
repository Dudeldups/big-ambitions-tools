import CreateSavegameForm from "./create-gamesave-form";

const Tools = () => {
  return (
    <div className="px-4 py-8">
      <section className="max-w-page mx-auto w-full">
        <hgroup>
          <h2>Let&apos;s get started</h2>
          <p>
            Create a new plan for your current playthrough. Select the
            difficulty so the tools can calculate the correct prices for the
            products and ingredients.
          </p>
        </hgroup>
      </section>

      <CreateSavegameForm />
    </div>
  );
};

export default Tools;

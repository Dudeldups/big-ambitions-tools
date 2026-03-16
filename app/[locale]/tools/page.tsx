import CreatePlaythroughForm from "./create-playthrough-form";

const Tools = () => {
  return (
    <div className="px-4 py-8">
      <section className="max-w-page mx-auto w-full">
        <hgroup>
          <h2>Your playthroughs</h2>
          <p>
            Here you can create and manage your playthroughs. A playthrough
            represents a single run of the game. You can create multiple
            playthroughs to compare different runs, experiment with different
            characters and difficulties, or just keep track of your progress.
          </p>
        </hgroup>

        <CreatePlaythroughForm />
      </section>
    </div>
  );
};

export default Tools;

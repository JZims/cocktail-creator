import shrooms from '../assets/images/Shrooms1.png';

export function NoneFound() {
  return (
    <div className="none-found">
      <img src={shrooms} alt="placeholder shrooms" className="none-found-image" />
      <h2> No cocktails found! </h2>
    </div>
  );
}
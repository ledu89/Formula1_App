import './Errormodal.css';

const ErrorModal = ({ title, message, onConfirm }) => {
	return (
		<div>
			<div className='backdrop' onClick={onConfirm} />
			<div className='modal'>
				<header className='modal-header'>
					<h2>{title}</h2>
				</header>
				<div className='modal-content'>
					<p>{message}</p>
				</div>
				<footer className='modal-actions'>
					<button className='modal-button' onClick={onConfirm}>
						Okay
					</button>
				</footer>
			</div>
		</div>
	);
};
export default ErrorModal;

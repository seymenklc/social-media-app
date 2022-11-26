export default function Pagination({ pageNums, paginate }) {
    return (
        <div className='btn-group'>
            {pageNums.map(num => (
                <button key={num} className="btn" onClick={() => paginate(num)}>
                    {num}
                </button>
            ))}
        </div>
    );
}
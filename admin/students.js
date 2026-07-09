// Load Students
function loadStudents() {

    db.collection("qrData")
      .orderBy("studentName")
      .get()
      .then((snapshot) => {

        let html = "";

        if (snapshot.empty) {

            html = `
            <tr>
                <td colspan="7">No Students Found</td>
            </tr>
            `;

        } else {

            snapshot.forEach((doc) => {

                const d = doc.data();

                html += `
                <tr>

                    <td>${doc.id}</td>

                    <td>${d.studentName || "-"}</td>

                    <td>${d.studentClass || "-"}</td>

                    <td>${d.mobile || "-"}</td>

                    <td>${d.active ? "✅ Active" : "❌ Inactive"}</td>

                    <td>${d.expiryDate || "-"}</td>

                    <td>
                        <button>Edit</button>
                        <button>Delete</button>
                    </td>

                </tr>
                `;
            });

        }

        document.getElementById("studentList").innerHTML = html;

      })

      .catch((error) => {

          document.getElementById("studentList").innerHTML =
          `
          <tr>
             <td colspan="7">
             ${error.message}
             </td>
          </tr>
          `;

      });

}

loadStudents();
